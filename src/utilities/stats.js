export const calculateBufferingEventsRate = (played, numeEvents) => {
  let totalPlayedTime = 0;
  for(let i = 0; i < played.length; i++ ){
     const start = played[i].start;
     const end = played[i].end;
     totalPlayedTime += ( end - start)
  }

  return numeEvents / totalPlayedTime;
}
