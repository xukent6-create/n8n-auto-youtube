const express = require("express");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs-extra");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(express.json());

const downloadFile = async (url, path) => {
  const writer = fs.createWriteStream(path);
  const response = await axios({ url, method: "GET", responseType: "stream" });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

app.post("/render", async (req, res) => {
  try {
    const id = uuidv4();
    const audioPath = `audio-${id}.mp3`;
    const videoPath = `video-${id}.mp4`;
    const outputPath = `output-${id}.mp4`;

    const { audioUrl, videoUrl, text } = req.body;

    await downloadFile(audioUrl, audioPath);
    await downloadFile(videoUrl, videoPath);

    ffmpeg()
      .addInput(videoPath)
      .addInput(audioPath)
      .videoFilters([
        {
          filter: "drawtext",
          options: {
            text: text,
            fontsize: 40,
            fontcolor: "white",
            x: "(w-text_w)/2",
            y: "h-100"
          }
        }
      ])
      .outputOptions("-shortest")
      .save(outputPath)
      .on("end", () => {
        res.download(outputPath);
      });

  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(3000, () => console.log("Server running"));
