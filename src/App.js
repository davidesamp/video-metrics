import React, { Component } from 'react';
import logo from './ball.svg';
import styles from './App.css';
import VideoPlayerSand from './components/video/VideoPlayer';
import VideoStats from './components/statics/data/VideoStats';
import CSSModules from 'react-css-modules';

class App extends Component {
  render() {
    return (
      <div className={'App'}>
        <header className={'AppHeader'}>
          <img src={logo} className={'AppLogo'} alt="logo" />
          <h1 className={'AppTitle'}>Video metrics</h1>
        </header>
        <p className={'AppIntro'}>
        </p>
        <main>
          <VideoPlayerSand/>
          <VideoStats/>
        </main>
      </div>
    );
  }
}

export default CSSModules(App, styles);
