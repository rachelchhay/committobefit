const express = require('express');
const User = require('../models/users.js');
const router = express.Router();
// require videos model

router.get('/', (req, res) => {
  res.send('User index page');
});







module.exports = router;
