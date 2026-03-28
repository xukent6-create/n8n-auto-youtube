app.post("/render", async (req, res) => {
  const text = req.body.text || "Hello";

  const output = `video_${Date.now()}.mp4`;

  const cmd = `
  ffmpeg -f lavfi -i color=c=black:s=1080x1920:d=10 \
  -vf "drawtext=text='${text}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2" \
  -y ${output}
  `;

  exec(cmd, (err) => {
    if (err) return res.status(500).send(err);

    res.json({
      url: `https://your-app.up.railway.app/${output}`
    });
  });
});
