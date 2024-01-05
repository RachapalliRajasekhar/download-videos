const fileSystem = require("fs");

const chalk = require("chalk");
const warningChalk = chalk.hex("#ffa500");
const successChalk = chalk.hex("#47c520");
const errorChalk = chalk.hex("#ff0026");
const infoChalk = chalk.hex("#ab2a9a");

function getCurrentDateTimeIST() {
  const now = new Date();
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    millisecond: "numeric",
    // eslint-disable-next-line @cspell/spellchecker
    timeZone: "Asia/Kolkata",
  };

  return now.toLocaleString("en-US", options).replace(/[,/]/g, "");
}

function printSuccess(message) {
  console.info(successChalk.bold(`${getCurrentDateTimeIST()}:- ${message}`));
}

function printError(message) {
  console.error(errorChalk.bold(`${getCurrentDateTimeIST()}:- ${message}`));
  throw error;
}

function printWarning(message) {
  console.warn(warningChalk.bold(`${getCurrentDateTimeIST()}:- ${message}`));
}

function printInfo(message) {
  console.warn(infoChalk.bold(`${getCurrentDateTimeIST()}:- ${message}`));
}

function generateSkipVideos({ skipVideoNumbers, ranges }) {
  let videoArray = [];
  if (!skipVideoNumbers[0]) {
    videoArray = ranges.flatMap((range) => getRangeNumbers(range));
  } else {
    videoArray = skipVideoNumbers;
  }

  return videoArray;
}

function getRangeNumbers(range) {
  if (typeof range === "string") {
    return Array.from(
      {
        length: range.split("-").reduce((acc, val) => val - acc, 0) + 1,
      },
      // eslint-disable-next-line id-length
      (_, index) => parseInt(range.split("-")[0]) + index
    );
  }
  return [range];
}

async function createFolder({ folderName }) {
  if (!fileSystem.existsSync(folderName)) {
    // eslint-disable-next-line no-unused-vars , id-length
    await fileSystem.mkdir(folderName, (error, _) => {
      if (error) {
        printError(`Error while create Folder ${JSON.stringify(error)}`);
      } else {
        printSuccess(`Folder Created ${folderName}/`);
      }
    });
  } else {
    printWarning(`Folder already Existed ${folderName}`);
  }
}
function getFinalStatus({ videosIndexes, playListLength }) {
  printSuccess(`downloaded Video Numbers: ${JSON.stringify(videosIndexes)}`);
  if (playListLength === videosIndexes?.length && videosIndexes?.length) {
    printSuccess(`All ${videosIndexes?.length} Videos are Downloaded!`);
  } else if (!videosIndexes?.length) {
    printWarning(`No Videos are Downloaded!`);
  } else {
    printWarning(
      `Only ${videosIndexes?.length}/${playListLength} Videos are Downloaded!`
    );
  }
}

module.exports = {
  getCurrentDateTimeIST,
  printSuccess,
  printError,
  printWarning,
  printInfo,
  generateSkipVideos,
  createFolder,
  getFinalStatus,
};
