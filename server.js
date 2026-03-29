const express = require("express");
const app = express();

app.use(express.json());

// Test
app.get("/", (req, res) => {
  res.send("🚀 n8n auto youtube server running");
});

// API render video (mock - bạn có thể nâng cấp sau)
app.post("/render", async (req, res) => {
  const { script, voice } = req.body;

  console.log("Render request:", script);

  // Fake output video URL (demo)
  res.json({
    status: "success",
    video_url: "https://samplelib.com/lib/preview/mp4/sample-5s.mp4"
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
