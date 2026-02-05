require("dotenv").config();
const express = require("express");
const cors = require("cors");

const chatRoutes = require("./routes/chat.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoutes);

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});