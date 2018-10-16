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
    Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) => {
      console.log(foundAuthor, ' this is foundAuthor')
        res.render('articles/show.ejs', {
          article: foundArticle,
          author: foundAuthor
        });
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
      foundAuthor.save((err, data) => {
        res.redirect('/articles')
      });
    });
  });
});

router.delete('/:id', (req, res)=>{
  Article.findByIdAndRemove(req.params.id, (err, deletedArticle)=>{
    // Now that we deleted the article from the Article Model's collection
    // we now want to remove the article from the Author.articles
    Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) => {
      // SO now that we found the Author with the article
      // we are going to go into that authors array and find the article
      // thats what the .id is doing (finding the article),
      // remember req.params.id is the article.id
      // then we are going to remove it
      foundAuthor.articles.id(req.params.id).remove();
      foundAuthor.save((err, data) => {
         res.redirect('/articles');
      });
    })
  });
});

router.put('/:id', (req, res)=>{
  Article.findOneAndUpdate(req.params.id, req.body, {new: true}, (err, updatedArticle)=>{
    // Once we updated the article in the articles collection
    // then we want to update the article in Author.articles
    Author.findOne({'articles._id': req.params.id}, (err, foundAuthor) => {
      // so now that I've found the author that has the article

      // Find that article and remove
      foundAuthor.articles.id(req.params.id).remove();
      // Then add the updateArticle to authors.articles array
      foundAuthor.articles.push(updatedArticle);
      foundAuthor.save((err, data) => {
        res.redirect('/articles');
      });
    });
  });
});






module.exports = router;
