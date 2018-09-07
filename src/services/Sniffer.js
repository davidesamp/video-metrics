import axios from 'axios';

const config = {
  server: 'https://5b9249cb4c818e001456e8f5.mockapi.io/video-metrics/v1/'
}
let lastDecodedFrames = 0;
let lastDroppedFrames = 0;
let intervalId;
let cachedDecodedFrames = [];
let Report = {
  platform: window.navigator.platform || 'not defined',
  snapshots: [],
  userAgent: window.navigator.userAgent || 'not defined',
  url: window.location.href || 'not defined'
};

const STYLE_WARNING = 'background: yellow; color: black;';
const STYLE_INFO = 'background: blue; color: white;';

const CDF_SIZE = 5;

const getDecodedFrameCount  = (video)  => {
    return video.webkitDecodedFrameCount;
}

const getDroppedFrameCount = (video) => {
  return video.webkitDroppedFrameCount;
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
     axios.post(config.server + 'metrics', JSON.stringify(Report)).then(res => {        
        console.log(res);
        console.log(res.data);
        const {id, decodeFrames } = res.data;
        sendJsonSnapshots(Report.snapshots, id)
     });
  }

const sendJsonSnapshots = (snapshots, metricId) => {
  snapshots.forEach((snap) => {
      snap.metricId = metricId;
      axios.post(config.server + 'snapshots', JSON.stringify(snap)).then(res => {
         debugger;
         console.log(res);
         console.log(res.data);
      });
  })
}

export const sniffVideoMetrics = () => {
  const video = document.querySelector('video');

  intervalId = setInterval(
        function () {
          Report.decodedFrames = getDecodedFrameCount(video);
          Report.droppedFrames = getDroppedFrameCount(video);


          // Create snapshot of the video frames performance data
          var snapshot = {
            timestamp: Date.now(),
            decodedFrames: Report.decodedFrames - lastDecodedFrames,
            droppedFrames: Report.droppedFrames - lastDroppedFrames
          };
          lastDecodedFrames = Report.decodedFrames;
          lastDroppedFrames = Report.droppedFrames;

          // As soon as we start decoding video frames, collect data
          if (snapshot.decodedFrames > 0) {
            Report.snapshots.push(snapshot);
            console.log('%ctimestamp: ' + snapshot.timestamp +
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
        }, 500
      );
}
