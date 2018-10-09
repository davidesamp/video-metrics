export const decodedFrameCount  = video  =>  video.webkitDecodedFrameCount;

export const decodedVideoByteCount  = video  => video.webkitVideoDecodedByteCount;

export const decodedAudioByteCount = video => video.webkitAudioDecodedByteCount;

export const displayIsFullscreen = video => video.webkitDisplayingFullscreen;

export const displaySupportFullScreen = video => video.webkitSupportsFullscreen;

export const droppedFrameCount = video => video.webkitDroppedFrameCount;

export const duration = video => video.duration;

export const paused = video => video.paused;

export const src = video => video.src;

export const networkState = video => video.networkState;

export const currentTime  = video => video.currentTime;
