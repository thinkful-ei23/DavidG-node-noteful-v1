'use strict';

const incomingLog = function(req, res, next){
  const date = new Date();
  console.log(date.toDateString(), date.toLocaleTimeString(), req.method, req.url);
  next();
};

module.exports = {incomingLog};
  