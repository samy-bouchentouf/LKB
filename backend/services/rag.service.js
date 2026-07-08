export const runRag = async (message) => {

  const response = await fetch("http://localhost:8000/rag", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      question: message
    })
  });

  if (!response.ok) {
    throw new Error(`Erreur FastAPI : ${response.status}`);
  }

  const data = await response.json();

  return data.answer;
};