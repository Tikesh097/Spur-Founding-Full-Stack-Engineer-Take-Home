require("dotenv").config();
const express = require("express");
const cors = require("cors");

const chatRoutes = require("./routes/chat.routes");

const app = express();

app.use(cors({
  origin: "*", // allow all origins (OK for assignment)
}));

app.use(express.json());

app.use("/chat", chatRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
