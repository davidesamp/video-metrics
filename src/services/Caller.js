import axios from 'axios';
import { API_SERVER } from '../config/config.js';


export const sendJsonReport = (report) => {
  console.log('report id in call --> ', report.id);
     return axios({
       method: report.id ? 'PUT' : 'POST',
       url:    report.id ?  API_SERVER + `metrics/${report.id}` : API_SERVER + 'metrics' ,
       data : report
      })
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

export const getIpAddress = () => {
  return axios({
    method: 'GET',
    url: 'http://api.hostip.info/get_html.php',
  })
}
