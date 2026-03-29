FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Cài FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

EXPOSE 3000

CMD ["node", "server.js"]
