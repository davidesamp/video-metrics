import React from 'react';
import { Table } from 'antd';
import CSSModules from 'react-css-modules';
import styles from './VideoStats.scss';
import axios from 'axios';
import 'antd/dist/antd.css';
import _ from 'lodash'

const config = {
  server: 'https://5b9249cb4c818e001456e8f5.mockapi.io/video-metrics/v1/'
}

class VideoStats extends React.Component {
  constructor() {
        super();
        this.state = {
            records: [],
            snapshots: []
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
             if(res.data && res.data.length > 0){

               _self.setState({
                 records : res.data
               }, () => _self._getSnapshots())
             }
          }).catch(networkError => {
              throw networkError;
          });
      }, 10000)
  }

  _getSnapshots = () =>  {
    const _self = this;
    axios({
      method: 'get',
      url: config.server + 'snaphots',
    }).then(res => {
       if(res.data && res.data.length > 0){
         _self.setState({
           snapshots : res.data
         })
       }
    }).catch(networkError => {
        throw networkError;
    });
  }

  _getInnerRow = (record) => {

    const columns = [
    { title: 'Effective Time', dataIndex: 'effectiveTime', key: 'effectiveTime' },
    { title: 'Decoded Frames (fps)', dataIndex: 'decodedFrames', key: 'decodedFrames' },
    { title: 'Dropped frames (fps)', dataIndex: 'droppedFrames', key: 'droppedFrames' },
    { title: 'Video BitRate (b/s)', dataIndex: 'videoBitRate', key: 'videoBitRate' },
    { title: 'Audio BitRate (b/s)', dataIndex: 'audioBitRate', key: 'audioBitRate' },
  ];

    const currentSnapshots = _.filter(this.state.snapshots, {'metricId': record.id});


    return (
      <Table
        columns={columns}
        dataSource={currentSnapshots}
      />
    )
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
          bordered
          columns={columns}
          dataSource={this.state.records}
          expandedRowRender={record => this._getInnerRow(record)}
          />
       </div>
    )

  }
}

export default VideoStats;
