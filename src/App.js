import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import VideoPlayer from './components/video/VideoPlayer';
import VideoStats from './components/statics/data/VideoStats';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Video metrics</h1>
        </header>
        <p className="App-intro">
        </p>
        <main>
          <VideoPlayer/>
          <VideoStats/>
        </main>
      </div>
    );
  }
}

export default App;
