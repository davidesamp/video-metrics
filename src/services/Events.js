let dateStartTimestamp = 0;
let canPlayTimeStamp = 0
let totalWaitingSeconds = 0;
let startWaitingSeconds = 0;
let rebufferingEventsNum = 0;

export const loadStart = (event, callback) => {
  console.log('loadStart --> ', event)
  dateStartTimestamp = (new Date()).getTime();
  if(callback) callback(event);
}

export const durationchange = (event, callback) => {
  console.log('durationchange --> ', event)
  if(callback) callback(event);
}

export const loadedmetadata = (event, callback) => {
  console.log('loadedmetadata --> ', event)
  if(callback) callback(event);
}

export const loadeddata = (event, callback) => {
  console.log('loadeddata --> ', event)
  if(callback) callback(event);
}

export const progress = (event, callback) => {
  const currentTime = (new Date()).getTime();
  console.log('progress --> ', event)
  if(startWaitingSeconds > 0)
  {
    console.log("Total waiting before --> ", totalWaitingSeconds);
    totalWaitingSeconds += (currentTime - startWaitingSeconds)
    startWaitingSeconds = 0;
    console.log("Total waiting after --> ", totalWaitingSeconds);;
  }
  if(callback) callback(event);
}

export const canplay = (event, callback) => {
  console.log('canplay --> ', event)
  canPlayTimeStamp = (new Date()).getTime();
  if(callback) callback(event);
}

export const canplaythrough = (event, callback) => {
  console.log('canplaythrough --> ', event)
  if(callback) callback(event);
}

export const waiting = (event, callback) => {
  console.log('waiting --> ', event)
  startWaitingSeconds =(new Date()).getTime();
  rebufferingEventsNum++;

  if(callback) callback(event);
}

export const getJoinedTime = () => {
    return canPlayTimeStamp && dateStartTimestamp ?
            canPlayTimeStamp - dateStartTimestamp : 0;
}

export const getTotalRebufferingTime = () => {
  return totalWaitingSeconds;
}

export const getTotalRebufferingEventsNum = () => {
  return rebufferingEventsNum;
}
