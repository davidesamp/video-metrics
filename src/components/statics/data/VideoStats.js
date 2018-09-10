import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CSSModules from 'react-css-modules';
import styles from './VideoStats.scss';
import { getSessionVideoMetrics } from '../../../services/metrics';
import _ from 'lodash';
import axios from 'axios';

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
    return (
       <Paper className={`${styles.paper}`}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell numeric>Decoded audio (Bytes)</TableCell>
                <TableCell numeric>Decoded video (Bytes)</TableCell>
                <TableCell numeric>Decoded Frames</TableCell>
                <TableCell numeric>Dropped Frames</TableCell>
                <TableCell numeric>User Agent</TableCell>
                <TableCell numeric>Url</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.records.map((record) => {
                return (
                  <TableRow>                    
                    <TableCell>{record.effectiveTime}</TableCell>
                    <TableCell>{record.decodedAudioBytes}</TableCell>
                    <TableCell>{record.decodedBytes}</TableCell>
                    <TableCell numeric>{record.decodedFrames}</TableCell>
                    <TableCell numeric>{record.droppedFrames}</TableCell>
                    <TableCell numeric>{record.userAgent}</TableCell>
                    <TableCell numeric>{record.url}</TableCell>
                  </TableRow>
                )
              })}

            </TableBody>
          </Table>
       </Paper>
    )

  }
}

export default CSSModules(VideoStats, styles)
