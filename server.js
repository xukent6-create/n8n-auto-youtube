const express = require("express");
const { exec } = require("child_process");
const fs = require("fs-extra");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

app.post("/render", async (req, res) => {
  const { script, voiceUrl, stockVideo } = req.body;

  const id = uuidv4();
  const audio = `audio-${id}.mp3`;
  const video = `video-${id}.mp4`;
  const output = `output-${id}.mp4`;

  // download audio
  const axios = require("axios");
  const writer = fs.createWriteStream(audio);
  const response = await axios.get(voiceUrl, { responseType: "stream" });
  response.data.pipe(writer);

  writer.on("finish", () => {
    const cmd = `
    ffmpeg -stream_loop -1 -i ${stockVideo} -i ${audio} \
    -shortest \
    -vf "drawtext=text='${script.slice(0,50)}...':x=10:y=H-th-10:fontsize=28:fontcolor=white" \
    -c:v libx264 -c:a aac ${output}
    `;

    exec(cmd, () => {
      res.download(output);
    });
  });
});

app.listen(3000, () => console.log("Server running"));
