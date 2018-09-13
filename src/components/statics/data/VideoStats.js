import React from 'react';
import { Table } from 'antd';
import CSSModules from 'react-css-modules';
import styles from './VideoStats.scss';
import axios from 'axios';
import 'antd/dist/antd.css';
import _ from 'lodash';
import { Button } from '@wyscout/wygui';

const config = {
  server: 'https://5b9249cb4c818e001456e8f5.mockapi.io/video-metrics/v1/'
}

const networkState = {
  0: 'NETWORK_EMPTY',
  1: 'NETWORK_IDLE',
  2: 'NETWORK_LOADING',
  3: 'NETWORK_NO_SOURCE'
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
               let totalMetrics = [];

               res.data.forEach(metric => {
                 _self._getSnapshotById(metric.id).then(res => {
                    if(res.data && res.data.length > 0){
                      totalMetrics.push({
                        ...metric,
                        snapshots: res.data,
                      });
                      _self.setState({
                        records : totalMetrics
                      })
                    }
                 }).catch(networkError => {
                     throw networkError;
                 });
               })



             }
          }).catch(networkError => {
              throw networkError;
          });
      }, 10000)
  }



  _getSnapshotById = (metricId) =>  {
    const _self = this;
    return  axios({
        method: 'get',
        url: config.server + 'metrics/' + metricId +  '/snaphots',
      })
  }

  _getSnapshotsByetricId = metricId => _.filter(this.state.snapshots, {'metricId': metricId});

  _getInnerRow = (record) => {

    const columns = [
    { title: 'Date', dataIndex: 'effectiveTime', key: 'effectiveTime', render: this._renderFormattedDate },
    { title: 'Decoded Frames (fps)', dataIndex: 'decodedFrames', key: 'decodedFrames' },
    { title: 'Dropped frames (fps)', dataIndex: 'droppedFrames', key: 'droppedFrames' },
    { title: 'Video BitRate (b/s)', dataIndex: 'videoBitRate', key: 'videoBitRate' },
    { title: 'Audio BitRate (b/s)', dataIndex: 'audioBitRate', key: 'audioBitRate' },
    { title: 'Network State', dataIndex: 'networkState', key: 'networkState', render: this._renderNetworState },
  ];

    const currentSnapshots = record.snapshots;

    return (
      <Table
        columns={columns}
        dataSource={currentSnapshots}
      />
    )
  }

  _deleteSnapshot = (snapshots, metricId) => {
    const _self = this;
    this.state.snapshots.forEach((snapshot) => {
      axios({
        method: 'DELETE',
        url: config.server + 'metrics/' + metricId + '/snaphots/' + snapshot.id ,
      }).then(res => {
      }).catch(networkError => {
          throw networkError;
      });
    });
  }

  _deleteAllRecords = () => {
    const _self = this;
    this.state.records.forEach((record) => {
      const metricId = record.id;
      axios({
        method: 'DELETE',
        url: config.server + 'metrics/' + metricId,
      }).then(res => {
          const currentSnapshots = this._getSnapshotsByetricId(metricId);
          this._deleteSnapshot(currentSnapshots, metricId)
      }).catch(networkError => {
          throw networkError;
      });
    })

    this.setState({
      records:[],
      snapshots:[]
    })
  }

  _getHeaderContent = () => {
    return (
      <div className={'stats-header'}>
      <Button
         className={'stats-header-clean'}
         label={'Clean'}
         theme={'primary'}
         disabled={!this.state.records || this.state.records.length <= 0}
         onClick={this._deleteAllRecords}/>
      </div>
    )
  }

  _renderTimesRanges = (ranges, arg2, arg3) => {
    debugger;
    return  Array.isArray(ranges) ? (
        <ul>
          {ranges.map((range, index) => <li className='table-times-range' key={index}>{`Start: ${range.start} - End: ${range.end}`}</li>)}
        </ul>
    ) : ( <span>{' N/D '}</span>)
  }

  _renderFormattedDate = (stringDate) => <span>{new Date(stringDate).toLocaleString()}</span>

  _renderNetworState = networStatusCode => <span>{networkState[networStatusCode]}</span>

  render () {
    const columns = [
      { title: 'Date Start', dataIndex: 'effectiveTime', key: 'effectiveTime', render: this._renderFormattedDate },
      { title: 'Decoded audio (Bytes)', dataIndex: 'decodedAudioBytes', key: 'decodedAudioBytes' },
      { title: 'Decoded Video (Bytes)', dataIndex: 'decodedBytes', key: 'decodedBytes' },
      { title: 'Decoded Frames', dataIndex: 'decodedFrames', key: 'decodedFrames' },
      { title: 'Dropped Frames', dataIndex: 'droppedFrames', key: 'droppedFrames' },
      { title: 'src', dataIndex: 'src', key: 'src' },
      { title: 'Duration (Seconds)', dataIndex: 'duration', key: 'duration' },
      { title: 'Buffered Times Ranges (Seconds)', dataIndex: 'bufferedRanges',  key: 'bufferedRanges', render: this._renderTimesRanges},
      { title: 'Seekable Times Ranges (Seconds)', dataIndex: 'seekableRanges',  key: 'seekableRanges', render: this._renderTimesRanges},
      { title: 'Played Times Ranges (Seconds)', dataIndex: 'playedRanges',  key: 'playedRanges', render: this._renderTimesRanges},
    ];

    const datasource = this.state.records.map((record) => {
       record.src = record.src.split('?')[0];
       return record;
    })

    return (
       <div className={'stats-container'}>
          {this._getHeaderContent()}
          <Table
          bordered
          columns={columns}
          dataSource={datasource}
          expandedRowRender={record => this._getInnerRow(record)}
          />
       </div>
    )

  }
}

export default CSSModules(VideoStats, styles);
