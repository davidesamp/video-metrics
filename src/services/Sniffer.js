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

import {
  loadStart,
  durationchange,
  loadedmetadata,
  loadeddata,
  progress,
  canplay,
  canplaythrough,
  waiting,
  getJoinedTime,
  getTotalRebufferingTime,
  getTotalRebufferingEventsNum,
} from './Events';

import { convertBytesToBits } from '../utilities/converter'

import {
  formatBufferedRanges,
  formatSeekableRanges,
  formatPlayedRanges,
} from '../utilities/utils.js';

import {
  sendJsonReport,
  sendJsonSnapshots,
  getIpAddress,
} from './Caller';

import { MAX_SNIFFING_SESSION} from '../config/config';

import  Report  from '../model/Report';

let lastDecodedFrames = 0;
let lastDroppedFrames = 0;
let lastDecodedBytes = 0;
let lastDecodedAudioBytes = 0;
let lastAudioBitRate = 0;
let lastVideoBitRate = 0;
let totalAudioBitRate = 0;
let totalVideoBitRate = 0;
let requestAnimationId = 0;

const STYLE_INFO = 'background: blue; color: white;';

export const sniffVideoMetrics = () => {
  const video = document.querySelector('video');
  video.addEventListener('loadstart', loadStart, false);
  video.addEventListener('durationchange', durationchange, false);
  video.addEventListener('loadedmetadata', loadedmetadata, false);
  video.addEventListener('loadeddata', loadeddata, false);
  video.addEventListener('progress', progress, false);
  video.addEventListener('canplay', canplay, false);
  video.addEventListener('canplaythrough', canplaythrough, false);
  video.addEventListener('waiting', waiting, false);

    const report = new Report();
    getIpAddress().then((response) => {
      if(response && response.data) {
        const hostipInfo =  response.data.split("\n");
        const ipAddress = hostipInfo[2].split(':')[1]
        report.setIpAddress(ipAddress)
      }
    })

  const requestAnimFrame = (function(){
      return  window.requestAnimationFrame   ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
  })();

  const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  let lastTime = (new Date()).getTime();
  //var displayNode = document.getElementById('display');
  let numSeconds = 0;
  let numPausedSeconds = 0;


  (function timer() {
    requestAnimationId =  requestAnimFrame(timer);

    if(numPausedSeconds > 20)
       cancelAnimationFrame(requestAnimationId);

    let currentTime = (new Date()).getTime();

    if (currentTime - lastTime >= 1000) {  //è passato un secondo
      lastTime = currentTime;
      numSeconds++;

      if(paused(video)) {
        numPausedSeconds++;
        console.log('Paused');
        return;
      }
      numPausedSeconds = 0;

      var metric  = {}

      metric.effectiveTime = new Date();
      metric.decodedFrames = decodedFrameCount(video);
      metric.droppedFrames = droppedFrameCount(video);
      metric.decodedBytes = decodedVideoByteCount(video)
      metric.decodedAudioBytes = decodedAudioByteCount(video);
      metric.displaySupportFullscreen = displaySupportFullScreen(video);
      metric.src = src(video);
      metric.duration = duration(video);
      metric.bufferedRanges = formatBufferedRanges(video);
      metric.playedRanges = formatPlayedRanges(video);
      metric.seekableRanges = formatSeekableRanges(video);
      totalVideoBitRate = convertBytesToBits(metric.decodedBytes);
      totalAudioBitRate = convertBytesToBits(metric.decodedAudioBytes);

      report.setReportProperties(metric)

      // Create snapshot of the video frames performance data
      var snapshot = {
        effectiveTime: new Date(),
        decodedFrames: report.decodedFrames - lastDecodedFrames,
        droppedFrames: report.droppedFrames - lastDroppedFrames,
        decodedBytes: report.decodedBytes - lastDecodedBytes,
        decodedAudioBytes: report.decodedAudioBytes - lastDecodedAudioBytes,
        displayIsFullscreen: displayIsFullscreen(video),
        videoBitRate: totalVideoBitRate - lastVideoBitRate,
        audioBitRate: totalAudioBitRate - lastAudioBitRate,
        currentTime : currentVideoTime(video),
        networkState: networkState(video),
      };

      lastDecodedFrames = report.decodedFrames;
      lastDroppedFrames = report.droppedFrames;
      lastDecodedBytes = report.decodedBytes;
      lastDecodedAudioBytes = report.decodedAudioBytes;
      lastAudioBitRate = totalAudioBitRate;
      lastVideoBitRate = totalVideoBitRate;

      // As soon as we start decoding video frames, collect data
      if (snapshot.decodedFrames > 0) {
        report.snapshots.push(snapshot);
        console.log('%effectiveTime: ' + snapshot.effectiveTime +
          ' decoded frames: ' + snapshot.decodedFrames +
          ' dropped frames: ' + snapshot.droppedFrames,
          STYLE_INFO);
      }

      if((report.snapshots && report.snapshots.length > 10) || numSeconds > MAX_SNIFFING_SESSION)
      {
          console.log('joinedTime --> ' + getJoinedTime());
          report.setJoinedTime(getJoinedTime());
          report.setRebufferingTime(getTotalRebufferingTime());
          report.setRebufferingEvents(getTotalRebufferingEventsNum());
          //Sdelete report.snapshots;
          const snapshotsToSave = Array.from(report.snapshots); //su mockapi salva tutto quindi devo eliminare le props che non ci sono in tabella
          sendJsonReport(report).then(res => {
            const {id} = res.data;
            sendJsonSnapshots(snapshotsToSave, id)
            report.id = id;
           });

          numSeconds = 0;
          report.clearSnapshots();
      }
    }
  }());
}
