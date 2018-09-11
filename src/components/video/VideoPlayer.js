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
      <div className="wygui app">
        {/*<video  preload={'none'} loop={'loop'} controls>
          <source src={'http://techslides.com/demos/sample-videos/small.webm'} type={'video/webm'}/>
          <source src={'http://techslides.com/demos/sample-videos/small.ogg'} type={'video/ogg'}/>
          <source src={'http://techslides.com/demos/sample-videos/small.mp4'} type={'video/mp4'}/>
          <source src={'http://techslides.com/demos/sample-videos/small.3gp'} type={'video/3gp'}/>
        </video>*/}

        <VideoPlayer
          onClosePlayer={this._onCloseVideo}
          onShareClips={this._onShareClips}
          onDownloadClips={this._onDownloadClips}
          token={'davideg'}
          userId={120619}
          groupId={200}
          subgroupId={1124}
          language={'it'}
          source={'match'}
          input={'2120720'}
          autoplay={false}
          quality="fullhd"
          modal={false}
          hideTools
      />
      </div>
    )
  }
}

export default VideoPlayerSand;
