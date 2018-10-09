import axios from 'axios';
import { API_SERVER } from '../config/config.js';


export const sendJsonReport = (report) => {
    const snapshots = report.snapshots;
    delete report.snapshots;
    const jsonReport = JSON.stringify(report)
     axios({
       method: 'POST',
       url: API_SERVER + 'metrics',
       data : report
      }).then(res => {
        const {id} = res.data;
        sendJsonSnapshots(snapshots, id)
     });
}

export const sendJsonSnapshots = (snapshots, metricId) => {
  if(Array.isArray(snapshots))
  {
    snapshots.forEach((snap) => {
      snap.metricId = metricId;

      axios({
        method: 'POST',
        url: API_SERVER + 'metrics/' + metricId + '/snaphots',
        data : snap
      }).then(res => {
      });
  })
  }
}
