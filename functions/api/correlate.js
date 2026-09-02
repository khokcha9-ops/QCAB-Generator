export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const keyword = url.searchParams.get('keyword');

  if (!keyword) {
    return new Response(JSON.stringify({ error: 'Missing search keyword' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Access secret API key stored in Cloudflare Dashboard
  const apiKey = env.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API key not configured in Cloudflare environment' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const prompt = `You are an expert UPSC curriculum coordinator. For the search term "${keyword}", output a JSON array of closely related sub-topics and alternate UPSC GS keywords (e.g., if topic is "Federalism", output ["Centre-State Relations", "Fiscal Federalism", "Governor", "Inter-State Water Disputes", "Seventh Schedule"]). Return ONLY a JSON array of strings and nothing else.`;

  try {
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await aiResponse.json();
    const rawText = data.candidates[0].content.parts[0].text;
    
    // Clean up potential markdown code block wrappers
    const cleanJson = rawText.replace(/```json|```/g, '').trim();
    const subtopics = JSON.parse(cleanJson);

    return new Response(JSON.stringify({ keyword, subtopics }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to process AI request', details: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
