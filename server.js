const express = require("express");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Server is running OK");
});

// RENDER VIDEO
app.post("/render", (req, res) => {
  const { script } = req.body;

  const cmd = `
  ffmpeg -f lavfi -i color=c=black:s=1080x1920:d=10 \
  -vf "drawtext=text='${script || "Hello"}':fontsize=40:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
  output.mp4
  `;

  exec(cmd, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("FFmpeg error");
    }

    res.download("output.mp4");
  });
});

// PORT FIX (QUAN TRỌNG)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
