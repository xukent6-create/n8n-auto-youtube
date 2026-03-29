const express = require("express");
const { exec } = require("child_process");
const app = express();

app.use(express.json());

app.post("/render", (req, res) => {
  const { script, audioUrl } = req.body;

  const cmd = `
  ffmpeg -f lavfi -i color=c=black:s=1080x1920:d=60 \
  -i ${audioUrl} \
  -vf "drawtext=text='${script}':fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h-200" \
  -shortest output.mp4
  `;

  exec(cmd, () => {
    res.download("output.mp4");
  });
});

app.listen(process.env.PORT || 3000);
