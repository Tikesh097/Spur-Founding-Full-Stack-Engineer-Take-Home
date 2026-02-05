const express = require("express");
const { v4: uuidv4 } = require("uuid");
const db = require("../db/db");
const generateReply = require("../services/llm.service");

const router = express.Router();

router.post("/message", async (req, res) => {
  let conversationId;

  try {
    const { message, sessionId } = req.body;

    // 1️⃣ Validate input
    if (!message || !message.trim()) {
      return res.status(400).json({
        error: "Message cannot be empty",
      });
    }

    // 2️⃣ Create or reuse conversation
    conversationId = sessionId;

    if (!conversationId) {
      conversationId = uuidv4();
      await db.execute(
        "INSERT INTO conversations (id) VALUES (?)",
        [conversationId]
      );
    }

    // 3️⃣ Save user message
    await db.execute(
      "INSERT INTO messages (conversation_id, sender, text) VALUES (?, 'user', ?)",
      [conversationId, message]
    );

    // 4️⃣ Fetch conversation history (last 10 messages)
    const [rows] = await db.execute(
      "SELECT sender, text FROM messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT 10",
      [conversationId]
    );

    const history = rows.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    }));

    // 5️⃣ Call LLM
    const aiReply = await generateReply(history, message);

    // 6️⃣ Save AI reply
    await db.execute(
      "INSERT INTO messages (conversation_id, sender, text) VALUES (?, 'ai', ?)",
      [conversationId, aiReply]
    );

    // 7️⃣ Send response to frontend
    res.json({
      reply: aiReply,
      sessionId: conversationId,
    });
  } catch (err) {
    console.error("Chat error:", err);

    // 8️⃣ Graceful failure (VERY IMPORTANT)
    res.json({
      reply:
        "Sorry, our support agent is temporarily unavailable. Please try again in a moment.",
      sessionId: conversationId,
    });
  }
});

module.exports = router;
