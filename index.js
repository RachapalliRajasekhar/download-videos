/* eslint-disable no-undef */
const dotenv = require("dotenv");
/* eslint-disable no-undef */
const env = process.env.NODE_ENV || "dev";
const envFile = env === "prod" ? ".env.prod" : ".env.dev";
dotenv.config({ path: envFile });
/* eslint-disable no-undef */
let skipVideoNumbers = JSON.parse(process.env.SKIP_VIDEO_NUMBERS) || [];
const folderPrefix = process.env.FOLDER_PREFIX || "";
const ranges = JSON.parse(process.env.SKIP_VIDEO_RANGES) || [];
const playListUrl = process.env.PLAY_LIST_URL;
const customFolderName = process.env.CUSTOM_FOLDER_NAME || "";
/* eslint-enable no-undef */
const youtubePlayList = require("ytpl");
const { downloadVideo } = require("./services/downloadVideo.service");

const {
  printError,
  printInfo,
  getFinalStatus,
  createFolder,
  generateSkipVideos,
} = require("./services/helper.service");

async function downloadPlaylist() {
  const videosIndexes = [];
  let playListLength = 0;

  try {
    printInfo(`Started Getting Playlist Info!`);
    const info = await youtubePlayList(playListUrl, { limit: Infinity });
    const {
      items: videoItems,
      title,
      author: { name },
    } = info;

    const folder =
      customFolderName || `${title} by ${name}`.replace(/[^a-zA-Z ]/g, "");
    const folderName = `${folderPrefix}${folder}`;
    await createFolder({ folderName });
    printInfo(`Started videos Download`);
    playListLength = videoItems.length;
    const skipVideos = generateSkipVideos({ skipVideoNumbers, ranges });
    for (const videoItem of videoItems) {
      const index = await downloadVideo({
        videoItem,
        folderName,
        skipVideos,
      });
      index ? videosIndexes.push(index) : undefined;
    }
  } catch (error) {
    printError(`Error downloading playlist: ${JSON.stringify(error)}`);
  } finally {
    getFinalStatus({ videosIndexes, playListLength });
  }
}

downloadPlaylist();
