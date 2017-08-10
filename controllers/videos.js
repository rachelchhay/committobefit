const express = require('express');
const User = require('../models/users.js');
const Videos = require('../models/videos.js');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');

// isLoggedIn function
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}


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
      user: user,
      currentUser: req.params.id
    });
  });
});

// Create videos
router.post('/', (req, res) => {
  console.log(req.body);
  console.log(req.body.username);
  if(req.body.equipment === 'on') {
    req.body.equipment = true;
  } else {
    req.body.equipment = false;
  }

  // res.send(req.body);
  Videos.create(req.body, (err, addedVideo) => {
    User.findOne({username: req.body.username}, (err, foundUser) => {
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
    res.render('videos/show.ejs', {
      video: foundVideo
    });
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

// Video update route that includes user and vid ID
router.get('/:user_id/:video_id/edit', (req, res) => {
  Videos.findById(req.params.video_id, (err, foundVideo) => {
    User.findById(req.params.user_id, (err, foundUser) => {
      User.findOne({'videos._id': req.params.video_id}, (err, foundUserVideo) => {
        res.render('videos/edit.ejs', {
          video: foundVideo,
          user: foundUser,
          userVideo: foundUserVideo,
          currentUser: req.params.user_id
        });
      });
    });
  });
});

// Video updated everywhere
router.put('/:id', (req, res) => {
  console.log('==================================');
  Videos.findByIdAndUpdate(req.params.id, req.body, (err, updatedVideo) => {
    User.findOne({'videos._id': req.params.id}, (err, foundUser) => {
      Videos.findOne({'_id': req.params.id}, (err, foundUpdatedVid) => {
        console.log('Updated Video found: ' + foundUpdatedVid);
        foundUser.videos.id(req.params.id).remove();
        foundUser.save((err, savedUser) => {
          foundUser.videos.push(foundUpdatedVid)
          foundUser.save((err, updatedUser) => {
            res.redirect('/users');
          });
        });
      });
    });
  });
});



module.exports = router;
