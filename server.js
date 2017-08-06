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

app.get('/', (req, res) => {
  res.render('index.ejs');
});


app.listen('3000', () => {
  console.log('Ready to get fit ============================');
});
