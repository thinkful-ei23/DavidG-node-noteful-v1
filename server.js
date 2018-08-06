'use strict';

const express = require('express');
const morgan = require('morgan');
const { PORT } = require('./config');
const notesRouter = require('./router/notes.router');

const app = express();

app.use(morgan('dev'));

app.use(express.static('public'));

app.use(express.json());

app.use('/api', notesRouter);

// Default 404 error
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Catch-all error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

// Declare `server` for use in `startServer` and `stopServer`
let server;

function startServer() {
  return new Promise((resolve, reject) => {
    server = app
      .listen(PORT, () => {
        console.log(`Starting server. Your app is listening on port ${PORT}`);
        resolve(server);
      })
      .on('error', err => {
        reject(err);
      });
  });
}

function stopServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

// Listen for incoming connections
if (require.main === module) {
  startServer().catch(err => {
    if (err.code === 'EADDRINUSE') {
      const stars = '*'.repeat(80);
      console.error(`${stars}\nEADDRINUSE (Error Address In Use). Please stop other web servers using port ${PORT}\n${stars}`);
    }
    console.error(err);
  });
}

// Export for testing
module.exports = { app, startServer, stopServer };