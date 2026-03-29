const express = require("express");
const fs = require("fs");
const axios = require("axios");
const app = express();

app.use(express.json());

app.post("/render", async (req, res) => {
  const { script } = req.body;

  // FAKE render (demo)
  const output = "output.mp4";

  fs.writeFileSync(output, "video content");

  res.download(output);
});

app.listen(3000, () => console.log("Server running"));
