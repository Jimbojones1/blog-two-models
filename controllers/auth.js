const express = require('express');
const router  = express.Router();
const User    = require('../models/users');

router.get('/login', (req, res) => {
  console.log(req.session)
  // ON EVERY SINGLE ROUTE IN THE WHOLE ENTIRE APPLICATION
  // you have attached to req a new property called session
  res.render('auth/login.ejs', {
    message: req.session.message
  });
});

router.post('/login', (req, res) => {

  // initializing the session here
  req.session.username = req.body.username;
  req.session.logged   = true;
  req.session.message  = '';
  res.redirect('/authors');
});

router.get('/logout', (req, res) => {
  // this basically restarts the session
  // and clears out all the properties that we set
  // on the session object
  req.session.destroy((err) => {
    if(err){
      res.send(err);
    } else {
      res.redirect('/auth/login')
    }
  });
});




module.exports = router;
