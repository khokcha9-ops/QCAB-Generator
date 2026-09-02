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

  const apiKey = env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'DEEPSEEK_API_KEY environment variable missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const prompt = `You are a UPSC subject expert. For the topic "${keyword}", output a JSON array of closely related sub-topics and keywords (e.g., if topic is "Federalism", output ["Centre-State Relations", "Fiscal Federalism", "Governor", "Inter-State Water Disputes"]). Output strictly a JSON array of strings and nothing else.`;

  try {
    const aiResponse = await fetch(
      'https://api.deepseek.com/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          response_format: { type: 'json_object' }
        })
      }
    );

    const data = await aiResponse.json();

    if (!aiResponse.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'DeepSeek API Error' }), {
        status: aiResponse.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const rawText = data.choices[0].message.content;
    const cleanJson = rawText.replace(/```json|```/g, '').trim();
    
    let subtopics = [];
    try {
      const parsed = JSON.parse(cleanJson);
      subtopics = Array.isArray(parsed) ? parsed : (parsed.subtopics || Object.values(parsed)[0] || []);
    } catch (e) {
      subtopics = [];
    }

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
