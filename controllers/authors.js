const express = require('express');
const router  = express.Router();
// Models job is to communicate with the DB
const Author  = require('../models/authors');

router.get('/', (req, res) => {
  Author.find({}, (err, foundAuthors) => {
    res.render('authors/index.ejs', {
      authors: foundAuthors
    });
  })

});

router.get('/new', (req, res) => {
  res.render('authors/new.ejs');
});

router.post('/', (req, res) => {

  Author.create(req.body, (err, createdAuthor) => {

    if(err){
      console.log(err)
    } else {
      res.redirect('/authors')
    }
  });

});



module.exports = router;
