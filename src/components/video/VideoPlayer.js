import React from 'react'
import PropTypes from 'prop-types'
import { sniffVideoMetrics } from '../../services/Sniffer';

class VideoPlayer extends React.Component {

  componentDidMount = () => {
    sniffVideoMetrics();
    //test
  }
  render () {
    return (
      <div>
        <video  preload={'none'} autoPlay={'autoplay'} loop={'loop'} controls>
          <source src={'http://techslides.com/demos/sample-videos/small.webm'} type={'video/webm'}/>
          <source src={'http://techslides.com/demos/sample-videos/small.ogg'} type={'video/ogg'}/>
          <source src={'http://techslides.com/demos/sample-videos/small.mp4'} type={'video/mp4'}/>
          <source src={'http://techslides.com/demos/sample-videos/small.3gp'} type={'video/3gp'}/>
        </video>
      </div>
    )
  }
}

export default VideoPlayer;
