const express = require('express');
const User = require('../models/users.js');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');

// require videos model

router.get('/', (req, res) => {
  res.send('User index page');
});

router.get('/register', (req, res) => {
  res.render('users/register.ejs');
});

router.get('/login', (req, res) => {
  res.render('users/login.ejs');
});






module.exports = router;
