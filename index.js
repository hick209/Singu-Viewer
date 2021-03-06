const path = require('path');
const request = require('request');

const express = require('express');
const app = express();

app.use('/ServiceWorker.js', express.static('ServiceWorker.js'));
app.use('/css', express.static('css'));
app.use('/app', express.static('app'));
app.use('/images', express.static('images'));
app.use('/node_modules', express.static('node_modules'));

app.post('/api/login', (req, response) => {
  const url = 'https://api.singu.com.br/v2/artist/login';
  const newRequest = request.post({uri: url, json: req.body});

  req.pipe(newRequest).pipe(response);
});

app.get('/api/requests', (req, response) => {
  const token = req.query.token;
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  const url = 'https://api.singu.com.br/v2/artist/free-schedules';
  const newRequest = request.get({uri: url, headers: headers});

  req.pipe(newRequest).pipe(response);
});

app.get('/api/agenda', (req, response) => {
  const token = req.query.token;
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  const url = 'https://api.singu.com.br/v2/artist/my-schedules/new';
  const newRequest = request.get({uri: url, headers: headers});

  req.pipe(newRequest).pipe(response);
});

app.get('/api/history', (req, response) => {
  const token = req.query.token;
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  const url = 'https://api.singu.com.br/v2/artist/my-schedules/old';
  const newRequest = request.get({uri: url, headers: headers});

  req.pipe(newRequest).pipe(response);
});

app.put('/api/agenda', (req, response) => {
  const token = req.query.token;
  const id = req.query.id;
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  const url = `https://api.singu.com.br/v2/artist/schedule/${id}`;
  const newRequest = request.put({uri: url, headers: headers});

  req.pipe(newRequest).pipe(response);
});


app.get('*', (req, response) => {
  response.sendFile(path.join(__dirname, 'app/index.html'));
});

const listener = app.listen(process.env.PORT || 80, () => {
    console.info(`Server started on port ${listener.address().port}!`);
});
