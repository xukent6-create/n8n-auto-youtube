import express from "express";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

// health check
app.get("/", (req, res) => {
  res.send("Server OK 🚀");
});

// render video endpoint
app.post("/render", async (req, res) => {
  try {
    const outputPath = path.join(process.cwd(), "output.mp4");

    // ❗ FFmpeg nhẹ (KHÔNG bị kill trên Railway)
    const cmd = `
    ffmpeg -y \
    -f lavfi -i color=c=black:s=720x1280:d=5 \
    -vf "drawtext=text='Hello World':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=(h-text_h)/2" \
    -c:v libx264 -preset ultrafast -crf 30 \
    -pix_fmt yuv420p \
    ${outputPath}
    `;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error("FFmpeg error:", stderr);
        return res.status(500).json({
          error: "FFmpeg failed",
          details: stderr,
        });
      }

      // trả file về
      res.download(outputPath, "video.mp4", (err) => {
        if (err) console.error(err);

        // xoá file sau khi gửi
        fs.unlink(outputPath, () => {});
      });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
