import {
  decodedFrameCount,
  decodedVideoByteCount,
  decodedAudioByteCount,
  displayIsFullscreen,
  displaySupportFullScreen,
  droppedFrameCount,
  duration,
  paused,
  src,
  networkState,
  currentTime as currentVideoTime,
} from './HTML5VideoProperties';

import { convertBytesToBits } from '../utilities/converter'

import {
  formatBufferedRanges,
  formatSeekableRanges,
  formatPlayedRanges,
} from '../utilities/utils.js';

import {
  sendJsonReport,
  sendJsonSnapshots,
} from './Caller';

let lastDecodedFrames = 0;
let lastDroppedFrames = 0;
let lastDecodedBytes = 0;
let lastDecodedAudioBytes = 0;
let lastAudioBitRate = 0;
let lastVideoBitRate = 0;
let totalAudioBitRate = 0;
let totalVideoBitRate = 0;
let intervalId;
let cachedDecodedFrames = [];

let Report = {
  platform: window.navigator.platform || 'not defined',
  snapshots: [],
  userAgent: window.navigator.userAgent || 'not defined',
  url: window.location.href || 'not defined',
  dowloadTime: null,
};

const STYLE_WARNING = 'background: yellow; color: black;';
const STYLE_INFO = 'background: blue; color: white;';

const CDF_SIZE = 5;

const lastElem = (elems) => {
  return elems[elems.length - 1];
}

const getUnequal = (elem, index, arr) => {
  return lastElem(arr) != elem;
}

const lastElemsAreEqual = (elems, n) => {
  if (lastElem(elems) === 0 || elems.length !== n) {
    return false
  }
  return elems.slice(elems.length - n, elems.length)
    .filter(getUnequal).length === 0;
}

const ID = () => {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
};


export const sniffVideoMetrics = () => {
  const video = document.querySelector('video');
  const dateNow = new Date();

  const requestAnimFrame = (function(){
      return  window.requestAnimationFrame   ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
  })();

  let lastTime = (new Date()).getTime();
  //var displayNode = document.getElementById('display');
  let numSeconds = 0;
  (function timer() {
    requestAnimFrame(timer);


    let currentTime = (new Date()).getTime();

    if (currentTime - lastTime >= 1000) {  //è passato un secondo
      lastTime = currentTime;
      numSeconds++;

      Report.effectiveTime = dateNow;
      Report.decodedFrames = decodedFrameCount(video);
      Report.droppedFrames = droppedFrameCount(video);
      Report.decodedBytes = decodedVideoByteCount(video)
      Report.decodedAudioBytes = decodedAudioByteCount(video);
      Report.displaySupportFullscreen = displaySupportFullScreen(video);
      Report.src = src(video);
      Report.duration = duration(video);
      Report.bufferedRanges = formatBufferedRanges(video);
      Report.playedRanges = formatPlayedRanges(video);
      Report.seekableRanges = formatSeekableRanges(video);
      totalVideoBitRate = convertBytesToBits(Report.decodedBytes);
      totalAudioBitRate = convertBytesToBits(Report.decodedAudioBytes);

      // Create snapshot of the video frames performance data
      var snapshot = {
        effectiveTime: new Date(),
        decodedFrames: Report.decodedFrames - lastDecodedFrames,
        droppedFrames: Report.droppedFrames - lastDroppedFrames,
        decodedBytes: Report.decodedBytes - lastDecodedBytes,
        decodedAudioBytes: Report.decodedAudioBytes - lastDecodedAudioBytes,
        displayIsFullscreen: displayIsFullscreen(video),
        videoBitRate: totalVideoBitRate - lastVideoBitRate,
        audioBitRate: totalAudioBitRate - lastAudioBitRate,
        currentTime : currentVideoTime(video),
        networkState: networkState(video),
      };

      lastDecodedFrames = Report.decodedFrames;
      lastDroppedFrames = Report.droppedFrames;
      lastDecodedBytes = Report.decodedBytes;
      lastDecodedAudioBytes = Report.decodedAudioBytes;
      lastAudioBitRate = totalAudioBitRate;
      lastVideoBitRate = totalVideoBitRate;

      // As soon as we start decoding video frames, collect data
      if (snapshot.decodedFrames > 0) {
        Report.snapshots.push(snapshot);
        console.log('%effectiveTime: ' + snapshot.effectiveTime +
          ' decoded frames: ' + snapshot.decodedFrames +
          ' dropped frames: ' + snapshot.droppedFrames,
          STYLE_INFO);
      }

      // Cache last N decoded frames (N=CDF_SIZE)
      cachedDecodedFrames.unshift(Report.decodedFrames);
      if (cachedDecodedFrames.length > CDF_SIZE) {
        cachedDecodedFrames.pop();
      }

      // Stop collecting data when decoded frames stop increasing
      // and send report to the server
       if (lastElemsAreEqual(cachedDecodedFrames, CDF_SIZE)) {
        clearInterval(intervalId);
        Report.snapshots.slice(0, Report.snapshots.length - CDF_SIZE + 1);
        sendJsonReport(Report);
      }


      //displayNode.innerText = numSeconds;
    }
  }());
}
