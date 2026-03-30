const express = require("express");
const { exec } = require("child_process");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// TEST
app.get("/", (req, res) => {
  res.send("Server OK 🚀");
});

// RENDER VIDEO
app.post("/render", async (req, res) => {
  try {
    const { audio_url, script } = req.body;

    if (!audio_url) {
      return res.status(400).send("Missing audio_url");
    }

    const audioPath = path.join(__dirname, "input.mp3");
    const outputPath = path.join(__dirname, "output.mp4");

    console.log("⬇️ Downloading audio...");

    // DOWNLOAD AUDIO
    const response = await axios({
      url: audio_url,
      method: "GET",
      responseType: "stream",
    });

    await new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(audioPath);
      response.data.pipe(stream);
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    console.log("✅ Audio downloaded");

    // FFMPEG COMMAND
    const cmd = `
    ffmpeg -y -i "${audioPath}" \
    -f lavfi -i color=c=black:s=1080x1920 \
    -shortest \
    -vf "drawtext=text='${(script || "Hello").replace(/:/g, "\\:")}':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=(h-text_h)/2" \
    -c:v libx264 -c:a aac -b:a 192k \
    "${outputPath}"
    `;

    console.log("🎬 Running ffmpeg...");

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.error("❌ FFmpeg error:", stderr);
        return res.status(500).send("FFmpeg error");
      }

      console.log("✅ Video created");

      res.download(outputPath, "video.mp4", () => {
        // cleanup
        fs.unlinkSync(audioPath);
        fs.unlinkSync(outputPath);
      });
    });

  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).send("Server error");
  }
});

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Running on " + PORT));
