const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const User = require('./models/users.js');

// middleware
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));

// Controller variables and MW

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
