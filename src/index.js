import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import WyApp from './WyApp';
import registerServiceWorker from './registerServiceWorker';
import '@wyscout/wygui/dist/bundle.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
