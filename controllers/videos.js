const express = require('express');
const User = require('../models/users.js');
const Videos = require('../models/videos.js');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Video index page (should display all vids)
router.get('/', (req, res) => {
  Videos.find({}, (err, foundVideos) => {
    res.render('videos/index.ejs', {
      videos: foundVideos
    });
  });
});

// Add new video page
router.get('/:id/new', (req, res) => {
  // find user by ID
  console.log('User ID ' + req.params.id);
  User.findById(req.params.id, (err, user) => {
    res.render('videos/new.ejs', {
      user: user
    });
  });
});

// Create videos
router.post('/', (req, res) => {
  console.log(req.body);
  console.log(req.body.postedBy);
  if(req.body.equipment === 'on') {
    req.body.equipment = true;
  } else {
    req.body.equipment = false;
  }

  // res.send(req.body);
  Videos.create(req.body, (err, addedVideo) => {
    User.findOne({username: req.body.postedBy}, (err, foundUser) => {
      console.log(foundUser);
      foundUser.videos.push(addedVideo)
      foundUser.save((err, data) => {
        res.redirect('/videos');
      });
    });
  });
});

// Video show page
router.get('/:id', (req, res) => {
  Videos.findById(req.params.id, (err, foundVideo) => {
    console.log(foundVideo);
    res.render('videos/show.ejs', {
      video: foundVideo
    });
  });
});

// Video edit page
router.get('/:id/edit', (req, res) => {
  Videos.findById(req.params.id, (err, foundVideo) => {
    res.render('videos/edit.ejs', {
      video: foundVideo
    });
  });
});

// ERR: can only update videos in the videos model
router.put('/:id', (req, res) => {
  Videos.findByIdAndUpdate(req.params.id, req.body, () => {
    res.redirect('/users');
  });
});

// Deletes videos in all places
router.delete('/:id', (req, res) => {
  Videos.findById(req.params.id, (err, foundVideo) => {
    User.findOne({'videos._id': req.params.id}, (err, foundUser) => {
      foundUser.videos.id(req.params.id).remove();
      foundUser.save((err, savedUser) => {
        res.redirect('/users');
      });
    });
  });
});


module.exports = router;
