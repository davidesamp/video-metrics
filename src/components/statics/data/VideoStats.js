import React from 'react';
import { Table } from 'antd';
import CSSModules from 'react-css-modules';
import styles from './VideoStats.scss';
import axios from 'axios';
import 'antd/dist/antd.css';

const config = {
  server: 'https://5b9249cb4c818e001456e8f5.mockapi.io/video-metrics/v1/'
}

class VideoStats extends React.Component {
  constructor() {
        super();
        this.state = {
            records: [],
        };
    }

  componentDidMount = () => {
    this._getMetrics();
  }

  _getMetrics = () =>  {
    const sessionId = localStorage.getItem('sessionId');
    const _self = this;

      let intervalId = setInterval(
        function () {
          axios({
            method: 'get',
            url: config.server + 'metrics',
          }).then(res => {
             console.log("Getted --> ", res.data);
             if(res.data && res.data.length > 0){
               console.log("Aggiorno state");
               _self.setState({
                 records : res.data
               })
             }
          }).catch(networkError => {
              throw networkError;
          });
      }, 10000)
  }

  render () {
    const columns = [
      { title: 'Effective Time', dataIndex: 'effectiveTime', key: 'effectiveTime' },
      { title: 'Decoded audio (Bytes)', dataIndex: 'decodedAudioBytes', key: 'decodedAudioBytes' },
      { title: 'Decoded Video (Bytes)', dataIndex: 'decodedBytes', key: 'decodedBytes' },
      { title: 'Decoded Frames', dataIndex: 'decodedFrames', key: 'decodedFrames' },
      { title: 'Dropped Frames', dataIndex: 'droppedFrames', key: 'droppedFrames' },
      { title: 'Url', dataIndex: 'url', key: 'url' },
    ];


    return (
       <div style={{'margin' : '100px'}}>
          <Table
          columns={columns}
          dataSource={this.state.records}
          expandedRowRender={record => <p style={{ margin: 0 }}>{record.userAgent}</p>}
          />
       </div>
    )

  }
}

export default VideoStats;
