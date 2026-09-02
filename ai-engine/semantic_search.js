export async function searchWithCloudflareAI(userKeyword) {
  // 1. Fetch related sub-topics from Cloudflare Proxy
  const response = await fetch(`https://qcabproxy.khokcha9.workers.dev/api/correlate?keyword=${encodeURIComponent(userKeyword)}`);
  const data = await response.json();
  const subtopics = data.subtopics || [];

  // 2. Fetch original untouched questions.json
  const questionsRes = await fetch('./questions.json');
  const allQuestions = await questionsRes.json();

  // 3. Extract key atomic words (handling "center" vs "centre", plurals, etc.)
  const rawTerms = [userKeyword, ...subtopics];
  
  // Clean, normalize, and extract significant words (length > 3)
  const keyWords = rawTerms
    .join(' ')
    .toLowerCase()
    .replace(/center/g, 'centre') // Handle American/British spelling variation
    .replace(/[^a-z0-9\s]/g, '')  // Strip punctuation
    .split(/\s+/)
    .filter(word => word.length > 3 && !['and', 'with', 'from', 'that', 'this', 'nature'].includes(word));

  // Remove duplicates
  const uniqueSearchWords = [...new Set(keyWords)];
  console.log("Tokens used for searching:", uniqueSearchWords);

  // 4. Filter questions: match if question text contains ANY of the key tokens
  const matchedQuestions = allQuestions.filter(q => {
    const questionText = `${q.question || ''} ${q.topic || ''} ${(q.tags || []).join(' ')}`.toLowerCase();
    
    // Match if at least one meaningful token is found in the question object
    return uniqueSearchWords.some(token => questionText.includes(token));
  });

  return matchedQuestions;
}
