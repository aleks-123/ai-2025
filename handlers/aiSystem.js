//! npm install cohere-ai
const { CohereClient } = require('cohere-ai');

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

const chatWithAI = async (prompt) => {
  try {
    const response = await cohere.v2.chat({
      model: 'command-r',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
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
