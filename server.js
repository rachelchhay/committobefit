const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const User = require('./models/users.js');
const Videos = require('./models/videos.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');

// middleware
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));


// Controller variables and MW
const userController = require('./controllers/users.js');
app.use('/users', userController);
const videosController = require('./controllers/videos.js');
app.use('/videos', videosController);

app.use(express.static('public'));

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

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fit'

mongoose.connect(mongoUri, {useMongoClient: true});
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

const port = process.env.PORT || 3000;

app.listen(port);
console.log('Ready to get fit on port: ' + port + ' ==============================');
