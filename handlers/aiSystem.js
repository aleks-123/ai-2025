//! npm install cohere-ai
const { CohereClient } = require("cohere-ai");

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const chatWithAI = async (prompt) => {
  try {
    const response = await cohere.v2.chat({
      model: "command-a-03-2025",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
    });

    console.log(response);

    return {
      success: true,
      answer: response.message.content[0].text,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};

module.exports = { chatWithAI };
