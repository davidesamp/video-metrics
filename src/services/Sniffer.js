import axios from 'axios';
import { convertBytesToBits } from '../utilities/converter'

const config = {
  server: 'https://5b9249cb4c818e001456e8f5.mockapi.io/video-metrics/v1/'
}
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
let downloadTime = 0;
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

const getDecodedFrameCount  = (video)  => {
    return video.webkitDecodedFrameCount;
}

const getDecodedVideoByteCount  = (video)  => {
    return video.webkitVideoDecodedByteCount;
}

const getDecodedAudioByteCount = (video) => {
  return video.webkitAudioDecodedByteCount;
}

const displayIsFullscreen = (video) => {
  return video.webkitDisplayingFullscreen;
}

const displaySupportFullScreen = (video) => {
  return video.webkitSupportsFullscreen;
}

const getDroppedFrameCount = (video) => {
  return video.webkitDroppedFrameCount;
}

const getDuration = video => video.duration;
const isPaused = video => video.paused;
const getSrc = video => video.src;

const getCurrentTime  = video => video.currentTime;

const testDowloadTime = (video) => {
  const initDate = new Date();
  axios({
    method: 'GET',
    headers: {
      'Content-Type': 'audio/mp4',
    },
    url: getSrc(video),
  }).then(res => {
      debugger;
      downloadTime = 2;
     if(res.date){
       const headersDate = res.date
       const finalDate = new Date();
       const diffwithHeader = initDate.getTime() - headersDate.getTime();
       const diffwithFinal = initDate.getTime() - finalDate.getTime();
       debugger;
     }
  }).catch(networkError => {
      throw networkError;
  });
}


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

const sendJsonReport = (Report) => {
    const snapshots = Report.snapshots;
    delete Report.snapshots;
    const jsonReport = JSON.stringify(Report)
     axios({
       method: 'POST',
       url: config.server + 'metrics',
       data : Report
      }).then(res => {
        const {id} = res.data;
        debugger;
        sendJsonSnapshots(snapshots, id)
     });
  }

const sendJsonSnapshots = (snapshots, metricId) => {
  if(Array.isArray(snapshots))
  {
    snapshots.forEach((snap) => {
      snap.metricId = metricId;

      axios({
        method: 'POST',
        url: config.server + 'metrics/' + metricId + '/snaphots',
        data : snap
      }).then(res => {
      });
  })
  }
}

const initSessionStorage  = () => {
  const id = ID();
  localStorage.setItem('sessionId', id);
  return id;
}

const formatBufferedRanges = (video) => {
  let formattedRanges = [];
  for(let i = 0; i < video.buffered.length; i++ ){
    formattedRanges.push({
      start : video.buffered.start(i),
      end: video.buffered.end(i)
    });
  }
  return formattedRanges;
}

const formatPlayedRanges = (video) => {
  let formattedPlayedRanges = [];
  for(let i = 0; i < video.played.length; i++ ){
    formattedPlayedRanges.push({
      start : video.played.start(i),
      end: video.played.end(i)
    });
  }
  return formattedPlayedRanges;
}


export const sniffVideoMetrics = () => {
  const video = document.querySelector('video');
  const dateNow = new Date();
  const sessionId = initSessionStorage()


  intervalId = setInterval(
        function () {
         /* if(!downloadTime) {
           testDowloadTime(video);
            Report.downlodTime = downloadTime;
          } */
          Report.effectiveTime = dateNow,
          Report.decodedFrames = getDecodedFrameCount(video);
          Report.droppedFrames = getDroppedFrameCount(video);
          Report.decodedBytes = getDecodedVideoByteCount(video)
          Report.decodedAudioBytes = getDecodedAudioByteCount(video);
          Report.displaySupportFullscreen = displaySupportFullScreen(video);
          Report.sessionId = sessionId
          Report.src = getSrc(video);
          Report.duration = getDuration(video);
          Report.bufferedRanges = formatBufferedRanges(video);
          Report.playedRanges = formatPlayedRanges(video);
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
            currentTime : getCurrentTime(video),
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
        }, 1000
      );
}
