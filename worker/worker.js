/**
 * QCAB Generator — Gemini proxy (Cloudflare Worker)
 *
 * Purpose: keep the Gemini API key server-side. The frontend calls THIS
 * worker; the worker calls Gemini. The key never reaches the browser.
 *
 * Deploy:
 *   1. npm install -g wrangler          (if you don't have it)
 *   2. wrangler login
 *   3. cd worker && wrangler deploy
 *   4. wrangler secret put GEMINI_API_KEY
 *        -> paste your key from Google AI Studio when prompted
 *
 * After deploy, wrangler prints a URL like:
 *   https://qcab-ai-proxy.<your-subdomain>.workers.dev
 * Put that URL into index.html's AI_PROXY_URL constant (see patch notes).
 */

// Only allow requests from your own site. Update this to your exact
// GitHub Pages origin (no trailing slash).
const ALLOWED_ORIGIN = "https://khokcha9-ops.github.io";

const SYSTEM_PROMPT_PREFIX = `Act as an expert UPSC/OPSC civil services mentor. Provide a rigorous, high-scoring structured model answer for this Mains question. Include:
- Introduction
- Body Paragraphs (with multi-dimensional headings e.g. Social, Economic, Governance, Administrative)
- Way Forward / Conclusion

Question: `;

function corsHeaders(origin) {
  const allow = origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const headers = corsHeaders(origin);

    // Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Use POST" }), {
        status: 405,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // Basic origin check (defense-in-depth; CORS header above is the
    // browser-side gate, this is a server-side one so curl/script abuse
    // from other origins is also rejected).
    if (origin && origin !== ALLOWED_ORIGIN) {
      return new Response(JSON.stringify({ error: "Origin not allowed" }), {
        status: 403,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const question = (body.question || "").toString().trim();
    if (!question) {
      return new Response(JSON.stringify({ error: "Missing 'question'" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }
    // Guard against absurdly long input hammering your quota.
    if (question.length > 2000) {
      return new Response(JSON.stringify({ error: "Question too long" }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    if (!env.GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Server misconfigured: missing API key" }),
        { status: 500, headers: { ...headers, "Content-Type": "application/json" } }
      );
    }

    const geminiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

    try {
      const geminiResp = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: SYSTEM_PROMPT_PREFIX + `"${question}"` }],
            },
          ],
        }),
      });

      const data = await geminiResp.json();

      if (!geminiResp.ok) {
        return new Response(
          JSON.stringify({ error: data?.error?.message || "Gemini request failed" }),
          { status: geminiResp.status, headers: { ...headers, "Content-Type": "application/json" } }
        );
      }

      const text =
        data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";

      return new Response(JSON.stringify({ text }), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Upstream request failed" }), {
        status: 502,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }
  },
};

