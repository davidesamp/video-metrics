export default class Report {
  constructor() {
    this.snapshots = [];
  }

  setReportProperties = (report) => {
    const { decodedFrames, droppedFrames, decodedBytes, decodedAudioBytes, src, duration, bufferedRanges, playedRanges, seekableRanges } = report;
    this.decodedFrames = decodedFrames;
    this.droppedFrames = droppedFrames;
    this.decodedBytes = decodedBytes;
    this.decodedAudioBytes = decodedAudioBytes;
    this.src = src;
    this.duration = duration;
    this.bufferedRanges = bufferedRanges;
    this.playedRanges = playedRanges;
    this.seekableRanges = seekableRanges;
  }

  setSnapshots = (snapshots) =>  {
    this.snapshots = snapshots;
  }

  clearSnapshots = () => this.snapshots = [];

  setJoinedTime = (joinedTime) => this.joinedTime = joinedTime;

  setRebufferingTime = (rebufferingTime) => this.rebufferingTime = rebufferingTime;

  setRebufferingEvents = (rebufferingEvents) => this.rebufferingEvents = rebufferingEvents;

  setIpAddress = (ipAddress) => this.ipAddress = ipAddress;

}
