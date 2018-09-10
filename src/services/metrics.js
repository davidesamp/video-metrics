import axios from 'axios';

const config = {
  server: 'https://5b9249cb4c818e001456e8f5.mockapi.io/video-metrics/v1/'
}

export const getSessionVideoMetrics = (sessionId) => {
  return () =>
      new Promise((resolve, reject) => {
        axios({
          method: 'GET',
          url: config.server + 'metrics',
        }).then(res => {
           console.log(res);
           console.log(res.data);
           resolve(res.data);
        }).catch(networkError => {
            throw networkError;
        });;
      });

}
