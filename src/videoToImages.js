const ffmpeg = require("ffmpeg")
const path = require("path")

const FRAMES = 300

try {
  const p = new ffmpeg(path.join(__dirname, "./video.mp4"))
  p.then(function (video) {
    video.fnExtractFrameToJPG(path.join(__dirname, "./images"), {
      frame_rate: 1,
      number: FRAMES,
      file_name: "%s"
    }, function (error, files) {
      if (!error)
        console.log("Frames: " + files);
    });
  }, function (err) {
    console.log("Error: " + err);
  });
} catch (e) {
  console.log(e.code);
  console.log(e.msg);
}


const Jimp = require("jimp")

;(async () => {
  for (let i = 1; i < FRAMES + 1; i++) {
    const image = await Jimp.read(path.join(__dirname, "./images", "1280x720_" + i + ".jpg"))
    image.resize(160, 90).write(path.join(__dirname, "./images", "160x90_" + i + ".jpg"))
  }
})()