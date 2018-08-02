'use strict';

const express = require('express');
const morgan = require('morgan');
const { PORT } = require('./config');
const incomingRouter = require('./router/notes.router');

const app = express();

app.use(morgan('dev'));

app.use(express.static('public'));

app.use(express.json());

app.use('/api', incomingRouter);

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});


const data = require('./db/notes');

const app = express();

// ADD STATIC SERVER HERE
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

app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

