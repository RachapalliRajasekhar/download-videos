const ProgressBar = require("progress");
const {
  printSuccess,
  printError,
  printInfo,
  printWarning,
} = require("./helper.service");
const youtubeDownload = require("ytdl-core");
const fileSystem = require("fs");

async function downloadVideo({ videoItem, folderName, skipVideos }) {
  const { title, index, shortUrl } = videoItem;
  const videoName = `${title}`.replace(/[^a-zA-Z0-9 ]/g, "").trim();
  if (!skipVideos.includes(index)) {
    printInfo(`Getting Video Info!`);
    const info = await youtubeDownload.getInfo(shortUrl);
    printInfo(`Setting Video Formate!`);
    const format = youtubeDownload.chooseFormat(info?.formats, {
      // eslint-disable-next-line @cspell/spellchecker
      quality: "highestaudio",
    });
    try {
      await downloadAndUploadVideo({
        format,
        videoName,
        ...videoItem,
        folderName,
      });
      return index;
    } catch (error) {
      printError(`Error downloading video ${index}:`, error);
      return false;
    }
  } else {
    printWarning(`Video was skipped ${index} ~ ${videoName}.mp4 !`);
    return index;
  }
}

function getProgressBar({ format, index }) {
  const totalSize = parseInt(
    (format?.bitrate * parseInt(format?.approxDurationMs)) / 1000,
    10
  );
  return new ProgressBar(`Downloading Video ${index}: [:bar] :percent :etas`, {
    complete: "@",
    incomplete: " ",
    width: 20,
    total: totalSize,
    clear: true,
  });
}
async function downloadAndUploadVideo({
  format,
  shortUrl,
  videoName,
  index,
  folderName,
}) {
  // eslint-disable-next-line no-unused-vars
  await new Promise((resolve, reject) => {
    const progressBar = getProgressBar({ format, index });
    const videoStream = youtubeDownload(shortUrl, { format });
    const videoWritableStream = fileSystem.createWriteStream(
      `${folderName}/${index} ~ ${videoName}.mp4`
    );
    videoStream.pipe(videoWritableStream);
    videoStream.on("error", (error) => {
      printError(`Error While Download Video: , ${JSON.stringify(error)}`);
    });
    videoWritableStream.on("error", (error) => {
      printError(`Error While Upload Video: , ${JSON.stringify(error)}`);
    });

    videoStream.on("data", (chunk) => {
      progressBar.tick((chunk?.length + 10) * 8);
    });
    videoStream.on("end", () => {
      printSuccess(`${index} Video downloaded successfully!`);
    });
    videoWritableStream.on("finish", () => {
      printSuccess(`${index} Video Uploaded successfully!`);
      resolve();
    });
  });
}
module.exports = {
  downloadVideo,
};
