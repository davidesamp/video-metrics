import React from 'react';
import {
    Content,
    ContentBody,
    ContentHeader,
} from '@wyscout/wygui';
import VideoPlayerSand from '../video/VideoPlayer';
import VideoStats from '../statics/data/VideoStats';

class ContentApp extends React.Component {

  render() {
    return (
      <Content>
        <ContentHeader title={'Metrics'}/>
        <ContentBody padded={false}>
          <VideoPlayerSand/>
          <VideoStats/>
        </ContentBody>
      </Content>
    )
  }
}

export default ContentApp;
