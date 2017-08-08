const express = require('express');
const User = require('../models/users.js');
const Videos = require('../models/videos.js');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');

router.get('/', (req, res) => {
  Videos.find({}, (err, foundVideos) => {
    res.render('videos/index.ejs', {
      videos: foundVideos
    });
  });
});

router.get('/new', (req, res) => {
  res.render('videos/new.ejs');
});

router.post('/', (req, res) => {
  if(req.body.equipment === 'on') {
    req.body.equipment = true;
  } else {
    req.body.equipment = false;
  }
  Videos.create(req.body, (err, addedVideo) => {
    res.redirect('/videos');
  });
});



module.exports = router;
