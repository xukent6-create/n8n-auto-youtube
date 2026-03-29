const express = require("express");
const fs = require("fs-extra");
const axios = require("axios");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("OK - n8n auto youtube running");
});

app.post("/render", async (req, res) => {
  try {
    const { script } = req.body;

    const audioPath = path.join(__dirname, "audio.mp3");
    const videoPath = path.join(__dirname, "video.mp4");
    const outputPath = path.join(__dirname, "output.mp4");

    // 🔊 1. Fake audio (demo - tránh crash)
    await fs.writeFile(audioPath, "");

    // 🎬 2. Tạo video nền màu đen (test)
    await new Promise((resolve, reject) => {
      ffmpeg()
        .input("color=c=black:s=720x1280:d=10")
        .inputFormat("lavfi")
        .outputOptions("-pix_fmt yuv420p")
        .save(videoPath)
        .on("end", resolve)
        .on("error", reject);
    });

    // 🎧 3. Merge audio + video
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .input(audioPath)
        .outputOptions("-shortest")
        .save(outputPath)
        .on("end", resolve)
        .on("error", reject);
    });

    return res.download(outputPath);

  } catch (err) {
    console.error(err);
    res.status(500).send("Render error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
