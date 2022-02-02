import http from "http";

export default {
  get (route, extra) {
    return new Promise((resolve, reject) => {
      http.request({
        hostname: 'localhost',
        port: 5000,
        path: route,
        method: 'GET',
        headers: {
          ...extra?.headers
        }
      }, res => {
        let response = '';
        let type = res.headers["content-type"];
        
        res.setEncoding('utf8');

        res.on('data', chunk => {
          response += chunk;
        });

        res.on('end', () => {
          resolve({ status: res.statusCode, data: type.indexOf('application/json') === 0 ? JSON.parse(response) : response, type });
        });

        res.on('error', err => {
          reject(err);
        });
      }).end();
    });
  },

  post (route, data, extra) {
    return new Promise((resolve, reject) => {
      const serializedData = JSON.stringify(data) || "";

      const req = http.request({
        hostname: 'localhost',
        port: 5000,
        path: route,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(serializedData),
          ...extra?.headers
        }
      }, res => {
        let response = '';
        let type = res.headers["content-type"];
        
        res.setEncoding('utf8');

        res.on('data', chunk => {
          response += chunk;
        });

        res.on('end', () => {
          resolve({ status: res.statusCode, data: type.indexOf('application/json') === 0 ? JSON.parse(response) : response, type });
        });

        res.on('error', err => {
          reject(err);
        });
      });

      req.write(serializedData);
      req.end();
    });
  }
}
