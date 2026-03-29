const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Test root
app.get("/", (req, res) => {
  res.send("✅ ONE CLICK FIX SERVER RUNNING");
});

// Fake render (ổn định tuyệt đối)
app.post("/render", async (req, res) => {
  const id = uuidv4();

  res.json({
    status: "success",
    video_url: `https://fake-video-url.com/${id}.mp4`,
    note: "Render giả lập để test pipeline OK"
  });
});

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
