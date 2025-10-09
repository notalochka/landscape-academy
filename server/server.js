const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/out")));

app.get("/api", (req, res) => {
  res.json({ message: "Landscape Academy API" });
});

// Обробка всіх інших роутів для SPA
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/out/index.html"));
});

app.listen(PORT, () => {
  console.log("Server started: http://localhost:" + PORT);
});
