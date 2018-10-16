const express = require('express');
const router  = express.Router();
const Article = require('../models/articles');
const Author  = require('../models/authors');


router.get('/', (req, res)=>{
  Article.find({}, (err, foundArticles)=>{
    res.render('articles/index.ejs', {
      articles: foundArticles
    });
  })
});


router.get('/new', (req, res) => {
  Author.find({}, (err, allAuthors) => {
    res.render('articles/new.ejs', {
      authors: allAuthors
    });
  })

})

router.get('/:id', (req, res)=>{
  Article.findById(req.params.id, (err, foundArticle)=>{

    res.render('articles/show.ejs', {
      article: foundArticle
    });
  });
});

router.get('/:id/edit', (req, res)=>{
  Article.findById(req.params.id, (err, foundArticle)=>{

    res.render('articles/edit.ejs', {
      article: foundArticle
    });
  });
});

router.post('/', (req, res)=>{

  // First we are finding the author that was chosen
  // from the browser
  Author.findById(req.body.authorId, (err, foundAuthor) => {
    // Then we are creating the article from the browser,
    // after we got the response from the Author query above ^
    Article.create(req.body, (err, createdArticle) => {

      // Then when we get the response from the article query
      // we tie the article to the author like below
      foundAuthor.articles.push(createdArticle);
      found.save((err, data) => {
        res.redirect('/articles')
      });
    });
  });
});

router.delete('/:id', (req, res)=>{
  Article.findByIdAndRemove(req.params.id, ()=>{
    res.redirect('/articles');
  });
});

router.put('/:id', (req, res)=>{
  Article.findOneAndDelete(req.params.id, req.body, ()=>{
    res.redirect('/articles');
  });
});

module.exports = router;
