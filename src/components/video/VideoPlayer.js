import React from 'react'
import PropTypes from 'prop-types'
import { sniffVideoMetrics } from '../../services/Sniffer';
import VideoPlayer from '@wyscout/video-player';

class VideoPlayerSand extends React.Component {

  componentDidMount = () => {
    sniffVideoMetrics();
    //test
  }

  _onCloseVideo = () => {

  }

  _onShareClips = () => {

  }

  _onDownloadClips = () => {

  }
  render () {
    return (
      <div style={{'width' : '50%', 'left' : '25%', 'position' : 'relative'}}>
       <VideoPlayer
          onClosePlayer={this._onCloseVideo}
          onShareClips={this._onShareClips}
          onDownloadClips={this._onDownloadClips}
          token={'davideg'}
          userId={120619}
          embedded
          groupId={200}
          subgroupId={1124}
          language={'it'}
          source={'match'}
          input={'2120720'}
          autoplay={false}
          quality="fullhd"
          hideTools
      />
      </div>
    )
  }
}

export default VideoPlayerSand;
