const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const User = require('./models/users.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// middleware
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));


// Controller variables and MW
const userController = require('./controllers/users.js');
app.use('/users', userController);

// Passport configuration
app.use(require('express-session')({
  secret: 'I love cake',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// mongo connection
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/commitToBeFit', {
  useMongoClient: true
});
mongoose.connection.once('open', () => {
  console.log('connected to Mongo');
});

// isLoggedIn function
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Auth routes ================================

// Register

app.get('/users/register', (req, res) => {
  res.render('users/register.ejs');
});

app.post('/users/register', (req, res) => {
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

app.get('/users/login', (req, res) => {
  res.render('users/login.ejs');
});
app.post('/users/login', passport.authenticate('local',
{
  successRedirect: '/users',
  failureRedirect: '/users/login'
}), (req, res) => {});

// Logout

app.get('/users/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


app.listen('3000', () => {
  console.log('Ready to get fit ============================');
});
