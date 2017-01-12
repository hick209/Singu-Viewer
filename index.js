const path = require('path');

const express = require('express');
const app = express();

app.use('/css', express.static('css'));
app.use('/app', express.static('app'));
app.use('/images', express.static('images'));
app.use('/node_modules', express.static('node_modules'));

app.get('*', (request, response) => {
  response.sendFile(path.join(__dirname, 'app/index.html'));
});

const listener = app.listen(process.env.PORT || 80, () => {
    console.info(`Server started on port ${listener.address().port}!`);
});
