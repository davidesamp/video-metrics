export const formatBufferedRanges = (video) => {
  let formattedRanges = [];
  for(let i = 0; i < video.buffered.length; i++ ){
    formattedRanges.push({
      start : video.buffered.start(i),
      end: video.buffered.end(i)
    });
  }
  return formattedRanges;
}

export const formatSeekableRanges = (video) => {
  let formattedSeekableRanges = [];
  for(let i = 0; i < video.seekable.length; i++ ){
    formattedSeekableRanges.push({
      start : video.seekable.start(i),
      end: video.seekable.end(i)
    });
  }
  return formattedSeekableRanges;
}

export const formatPlayedRanges = (video) => {
  let formattedPlayedRanges = [];
  for(let i = 0; i < video.played.length; i++ ){
    formattedPlayedRanges.push({
      start : video.played.start(i),
      end: video.played.end(i)
    });
  }
  return formattedPlayedRanges;
}
