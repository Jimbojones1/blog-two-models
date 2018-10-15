const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
  Article.find({}, (err, foundArticles)=>{
    res.render('articles/index.ejs', {
      articles: foundArticles
    });
  })
});



router.get('/:id', (req, res)=>{
  Article.findById(req.params.id, (err, foundArticle)=>{
    res.render('article/show.ejs', {
      article: foundArticle
    });
  });
});

router.get('/:id/edit', (req, res)=>{
  Article.findById(req.body.id, (err, foundArticle)=>{
    res.render('articles/edit.ejs', {
      article: foundArticle
    });
  });
});

router.post('/', (req, res)=>{

});

router.delete('/:id', (req, res)=>{
  Article.findByIdAndRemove(req.body.id, ()=>{
    res.redirect('/article');
  });
});

router.put('/:id', (req, res)=>{
  Article.findByIdAndUpdate(req.params.id, req.query, ()=>{
    res.redirect('/articles');
  });
});

module.exports = router;
