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
      temperature: 0.2,
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

const chatWithAITools = async ({ systemMessage, userPrompt, tools, toolHandlers, temperature = 0.2 }) => {
  try {
    const messages = [
      { role: "system", content: systemMessage },
      { role: "user", content: userPrompt },
    ];

    let response = await cohere.v2.chat({
      model: "command-a-03-2025",
      messages,
      tools,
      temperature,
    });

    console.log("response1", response);

    if (response.message.toolCalls && response.message.toolCalls.length > 0) {
      messages.push({
        role: "assistant",
        toolCalls: response.message.toolCalls,
        toolPlan: response.message.toolPlan,
      });

      console.log(response.message.toolCalls);
      for (const call of response.message.toolCalls) {
        console.log(call);
        const handler = toolHandlers[call.function.name];
        const args = JSON.parse(call.function.arguments || "{}");
        console.log(args);
        const result = handler ? await handler(args) : { error: "nepoznat tool" };
        console.log(result);
        messages.push({
          role: "tool",
          toolCallId: call.id,
          content: JSON.stringify(result),
        });
      }

      response = await cohere.v2.chat({
        model: "command-a-03-2025",
        messages,
        tools,
        temperature,
      });
      console.log("response2", response);
    }

    return {
      success: true,
      answer: response.message.content?.[0]?.text ?? "",
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
};

module.exports = { chatWithAI, chatWithAITools };
