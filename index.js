const path = require('path');
const request = require('request');

const express = require('express');
const app = express();

app.use('/css', express.static('css'));
app.use('/app', express.static('app'));
app.use('/images', express.static('images'));
app.use('/node_modules', express.static('node_modules'));

app.post('/api/login', (req, response) => {
  var url = 'https://api.singu.com.br/v2/artist/login';
  var newRequest = request.post({uri: url, json: req.body});

  req.pipe(newRequest).pipe(response);
});

app.get('/api/requests', (req, response) => {
  const token = req.query.token;
  const headers = {
    'Authorization': `Bearer ${token}`,
  };

  var url = 'https://api.singu.com.br/v2/artist/free-schedules';
  var newRequest = request.get({uri: url, headers: headers});

  req.pipe(newRequest).pipe(response);
});


app.get('*', (req, response) => {
  response.sendFile(path.join(__dirname, 'app/index.html'));
});

const listener = app.listen(process.env.PORT || 80, () => {
    console.info(`Server started on port ${listener.address().port}!`);
});
