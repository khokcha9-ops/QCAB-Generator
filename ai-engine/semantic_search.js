export async function searchWithCloudflareAI(userKeyword) {
  // 1. Fetch related sub-topics from your new serverless Cloudflare API
  const response = await fetch(`/api/correlate?keyword=${encodeURIComponent(userKeyword)}`);
  const { subtopics } = await response.json();

  const searchTerms = [userKeyword.toLowerCase(), ...(subtopics || []).map(t => t.toLowerCase())];

  // 2. Fetch original untouched questions.json
  const questionsRes = await fetch('../questions.json');
  const allQuestions = await questionsRes.json();

  // 3. Match questions containing keyword or expanded sub-topics
  return allQuestions.filter(q => {
    const textToMatch = `${q.question} ${q.topic || ''} ${(q.tags || []).join(' ')}`.toLowerCase();
    return searchTerms.some(term => textToMatch.includes(term));
  });
}
