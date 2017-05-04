const spdy = require('spdy')
const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

app.get('/', (req, res) => {
    res
      .status(200)
      .json({message: 'ok'})
});

app.get('/push', (req, res) => {
    const message = {
        msg: 'hellow',
    };
    var stream = res.push('/main.js', {
      status: 200,
      method: 'GET',
      request: {
        accept: '*/*'
      },
      response: {
        'content-type': 'application/javascript'
      }
    })
    stream.on('error', function() {
    })
    stream.end('alert("hello from push stream!");')
    res.end('<script src="/main.js"></script>');
});

const options = {
    key: fs.readFileSync(__dirname + '/server.key'),
    cert:  fs.readFileSync(__dirname + '/server.crt')
}
const port = 3000;
spdy.createServer(options, app)
    .listen(port, (error) => {
        if (error) {
            console.error(error)
            return process.exit(1)
        } else {
            console.log('Listening on port: ' + port + '.')
        }
  });
