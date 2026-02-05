const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateReply(history, userMessage) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are a helpful customer support agent for a small e-commerce store.

Shipping:
- Ships to India, USA, UK
- Delivery in 5–7 business days

Returns:
- 7-day return policy
- Items must be unused

Support:
- Mon–Fri, 9am–6pm IST
`,
      },
      ...history,
      { role: "user", content: userMessage },
    ],
    max_tokens: 200,
  });

  return completion.choices[0].message.content;
}

module.exports = generateReply;
