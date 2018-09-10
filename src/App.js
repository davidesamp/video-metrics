import React, { Component } from 'react';
import logo from './logo.svg';
import styles from './App.css';
import VideoPlayer from './components/video/VideoPlayer';
import VideoStats from './components/statics/data/VideoStats';
import CSSModules from 'react-css-modules';

class App extends Component {
  render() {
    return (
      <div className={styles.App}>
        <header className={styles.AppHeader}>
          <img src={logo} className={styles.AppLogo} alt="logo" />
          <h1 className={styles.AppTitle}>Video metrics</h1>
        </header>
        <p className={styles.AppIntro}>
        </p>
        <main>
          <VideoPlayer/>
          <VideoStats/>
        </main>
      </div>
    );
  }
}

export default CSSModules(App, styles);
