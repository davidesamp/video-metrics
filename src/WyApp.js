import React from 'react';
import { App  } from '@wyscout/wygui';
import ContentApp from './components/layout/ContentApp';

class WyApp extends React.Component {

  render () {
    return (
      <App
          title={'Video Metrics'}
          icon={'logo.svg'}
          content={<ContentApp/>}
          dark={false}/>
    )
  }
}

export default WyApp;
