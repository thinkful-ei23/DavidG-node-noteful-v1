'use strict';
const express = require('express');

const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

router.get('/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  notes.filter(searchTerm)
    .then(list => {
      if(list){
        res.json(list);
      }
    })
    .catch(err => {
      next(err);
    });
});

router.get('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.find(id)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.put('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  const updateNote = {};
  const updateableFields = ['title', 'content'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updateNote[field] = req.body[field];
    }
  });
 
  if (!updateNote.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  notes.update(id, updateNote)
    .then(item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title || !newItem.content) {
    const err = new Error('Missing `title` or content in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem)
    .then(item => {
      if (item){
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      return next(err);
    });
});

router.delete('/notes/:id', (req, res, next) => {
  const id = req.params.id;
  notes.delete(id)
    .then(item => {
      if (item){
        res.sendStatus(204);
      }
    })
    .catch(err => {
      return next(err);
    });
});
module.exports = router;