const express = require("express");
const { exec } = require("child_process");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.post("/render", async (req, res) => {
 const text = req.body.text;
 const id = Date.now();
 const output = `video_${id}.mp4`;

 const cmd = `
 ffmpeg -f lavfi -i color=c=black:s=1080x1920:d=60 \
 -vf "drawtext=text='${text}':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=(h-text_h)/2" \
 -y ${output}
 `;

 exec(cmd, () => {
   res.json({ url: `https://your-app.up.railway.app/${output}` });
 });
});

app.listen(3000);
