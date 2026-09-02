export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  let keyword = '';

  // Extract keyword from query param (GET) or JSON payload (POST)
  if (request.method === 'GET') {
    keyword = url.searchParams.get('keyword');
  } else if (request.method === 'POST') {
    try {
      const body = await request.json();
      keyword = body.keyword;
    } catch (e) {
      keyword = '';
    }
  }

  if (!keyword) {
    return new Response(JSON.stringify({ error: 'Missing keyword parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const apiKey = env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY environment variable missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const prompt = `You are a UPSC subject expert. For the topic "${keyword}", output a JSON array of closely related sub-topics and keywords (e.g., if topic is "Federalism", output ["Centre-State Relations", "Fiscal Federalism", "Governor", "Inter-State Water Disputes"]). Output strictly a JSON array of strings and nothing else.`;

  try {
    const aiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
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
