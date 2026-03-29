# Auto Video Render Server

Server để tự động render video với:

✔ Video stock  
✔ Voice TTS  
✔ Subtitle auto  
✔ Background music  
✔ Hook 3s đầu  

### POST /render

Body JSON:
```json
{
  "script": "Your video script text….",
  "voiceUrl": "URL to audio file",
  "videoUrl": "URL to stock video background"
}
