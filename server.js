const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");
const { exec } = require("child_process");

const app = express();
app.use(express.json());

app.post("/render", async (req, res) => {
  try {
    const { script, voiceUrl, videoUrl } = req.body;

    // 1) Download video
    const videoPath = "input.mp4";
    const videoBuffer = await fetch(videoUrl).then((r) => r.buffer());
    fs.writeFileSync(videoPath, videoBuffer);

    // 2) Download voice
    const audioPath = "voice.mp3";
    const audioBuffer = await fetch(voiceUrl).then((r) => r.buffer());
    fs.writeFileSync(audioPath, audioBuffer);

    // 3) Create subtitle file (SRT format)
    const subs = script
      .split(".")
      .map((text, idx) => `${idx + 1}\n${idx * 3}:00 --> ${(idx + 1) * 3}:00\n${text.trim()}\n`)
      .join("\n");
    fs.writeFileSync("subs.srt", subs);

    // 4) Add background music
    const musicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    const musicPath = "bgmusic.mp3";
    const musicBuffer = await fetch(musicUrl).then((r) => r.buffer());
    fs.writeFileSync(musicPath, musicBuffer);

    // 5) FFmpeg render
    // Hook 3s: fadein audio, overlay text, subtitle & music
    const out = "output.mp4";
    const cmd = `ffmpeg -y -i ${videoPath} -i ${audioPath} -i ${musicPath} -filter_complex \
"[1:a]afade=t=in:ss=0:d=3[a1]; \
[0:v][2:a]concat=n=1:v=1:a=1[v][a]; \
[v]subtitles=subs.srt[vout]" -map "[vout]" -map "[a1]" -c:v libx264 -c:a aac ${out}`;

    exec(cmd, (err) => {
      if (err) return res.status(500).send(err.toString());
      res.sendFile(`${process.cwd()}/${out}`);
    });
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Video render server running")
);
