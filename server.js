const express = require("express");
const fs = require("fs-extra");
const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server running OK");
});

app.post("/render", async (req, res) => {
  try {
    const { script, audio_url } = req.body;

    const videoUrl = "https://cdn.pixabay.com/video/2023/05/15/163102-826671914_large.mp4";

    await fs.ensureDir("temp");

    const videoPath = "temp/video.mp4";
    const audioPath = "temp/audio.mp3";
    const outputPath = "temp/output.mp4";

    // tải video
    const video = await axios.get(videoUrl, { responseType: "stream" });
    video.data.pipe(fs.createWriteStream(videoPath));

    // tải audio
    const audio = await axios.get(audio_url, { responseType: "stream" });
    audio.data.pipe(fs.createWriteStream(audioPath));

    // chờ tải xong
    await new Promise(resolve => setTimeout(resolve, 5000));

    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .outputOptions("-shortest")
      .save(outputPath)
      .on("end", () => {
        res.download(outputPath);
      });

  } catch (err) {
    console.error(err);
    res.status(500).send("Render error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server started on port " + PORT));
