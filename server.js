'use strict';

const express = require('express');

const data = require('./db/notes');

const { PORT } = require('./config');

const {incomingLog} = require('./middleware/logger');

const app = express();



// ADD STATIC SERVER HERE
app.use(incomingLog);

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.use(express.static('public'));




app.get('/api/notes', (req, res) => {
  const results = req.query.searchTerm;
  console.log(results);
  if (results){
    let searchResults = data.filter(function(item) {
      return item.title.includes(results);
    });
    res.json(searchResults);
  } else{
    res.json(data);
  }
});

app.get('/api/notes/:id', (req, res) => {
  const {id} = req.params;
  let note = data.find(function(item){
    return item.id === Number(id);
  });
  res.json(note);
});

app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});
