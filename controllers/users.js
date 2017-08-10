const express = require('express');
const User = require('../models/users.js');
const Videos = require('../models/videos.js');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');


// Passport configuration
router.use(require('express-session')({
  secret: 'I love cake',
  resave: false,
  saveUninitialized: false
}));
router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// isLoggedIn function
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

// User Profile Page (index.ejs)
router.get('/', isLoggedIn, (req, res) => {
  console.log(req.user.username + ' is logged in');
  User.findById(req.user._id, (err, user) => {
    console.log('User videos: ' + user.videos);
    res.render('users/index.ejs', {
      user: user,
      videos: user.videos,
      currentUser: req.user.username
    });
  });
});





// Auth routes ========================================

// Register

router.get('/register', (req, res) => {
  res.render('users/register.ejs');
});

router.post('/register', (req, res) => {
  const newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, userCreated) => {
    if(err){
      console.log(err);
      return res.render('users/register.ejs');
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/users');
    });
  });
});


// Login

router.get('/login', (req, res) => {
  res.render('users/login.ejs');
});
router.post('/login', passport.authenticate('local',
{
  successRedirect: '/users',
  failureRedirect: '/users/login'
}), (req, res) => {
});

// Logout

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
// Auth routes END ======================================

// Edit user info
router.get('/:id/edit', (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    res.render('users/edit.ejs', {
      currentUser: req.user.username
    });
  });
});

// Update user info
router.put('/', (req, res) => {
    User.findByIdAndUpdate(req.user.id, {username: req.body.username}, (err, foundUser) => {
      res.redirect('/users');
    });
});

router.get('/:id', isLoggedIn, (req, res) => {

});

// Delete user
router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.user.id, (err, removeUser) => {
    res.redirect('/');
  });
});





module.exports = router;
