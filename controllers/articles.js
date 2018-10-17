const express = require('express');
const router  = express.Router();
const Article = require('../models/articles');
const Author  = require('../models/authors');


router.get('/', async (req, res)=>{

       try  {

            const foundArticles = await Article.find({});

            res.render('articles/index.ejs', {
              articles: foundArticles,
            });

          } catch (err){

            res.send(err);

          }

});

router.get('/new', async (req, res)=>{
  try {

     const allAuthors = await Author.find();

      res.render('articles/new.ejs', {
          authors: allAuthors
        });

  } catch (err) {

      res.send(err);
  }
});

router.get('/:id', async (req, res)=>{


  try {
      const findArticle = Article.findById(req.params.id);
      const findAuthor  = Author.findOne({'articles._id': req.params.id});

      // Promise All returns an array of the repsonse from DB queries,
      // Using array destructing to save the corresponding responses
      // as the variables thisArticle, and foundAuthor
      // the array destructering is the const [thisArticle, foundAuther]
      // Basially what this is doing is creating varaibles for each index in the array that
      // is returned from await Promise.all([findArticle, findAuthor])
      //if you are still confused look up array destructering, its fancy new javascript
      const [foundArticle, foundAuthor] = await Promise.all([findArticle, findAuthor]);

      // The above is short for
      // const finishedPromiseArray = await Promise.all([findArticle, findAuthor]);
      // const foundArticle = finishedPromiseArray[0];
      // const foundAuthor  = finishedPromiseArray[1];
      res.render('articles/show.ejs', {
        article: foundArticle,
        author: foundAuthor
      });

  } catch (err) {

    next(err);
  }

});

router.get('/:id/edit', async (req, res) => {
  try {

      const findArticle = Article.findById(req.params.id);
      const findAllAuthors = Author.find();
      const findArticleAuthor = Author.findOne({'articles._id': req.params.id});

      const [foundArticle, allAuthors, foundArticleAuthor] = await Promise.all([findArticle, findAllAuthors, findArticleAuthor]);

      res.render('articles/edit.ejs', {
            article: foundArticle,
            authors: allAuthors,
            articleAuthor: foundArticleAuthor
          });

  } catch (err) {

      res.send(err);

  }

});

router.post('/', async (req, res)=>{
   try {

      const findAuthor = Author.findById(req.body.authorId);
      const createArticle = Article.create(req.body);

      const [foundAuthor, createdArticle] = await Promise.all([findAuthor, createArticle]);
      foundAuthor.articles.push(createdArticle);

      await foundAuthor.save();
      res.redirect('/articles');

  } catch(err){
    console.log('errroor')
     res.send(err);
  }
});

router.delete('/:id', async (req, res)=>{
  try {

        const deleteArticle = Article.findByIdAndRemove(req.params.id);
        const findAuthor    = Author.findOne({'articles._id': req.params.id});

        const [deletedArticle, foundAuthor] = await Promise.all([deleteArticle, findAuthor]);

        foundAuthor.articles.id(req.params.id).remove();

        await foundAuthor.save();

        res.redirect('/articles');

    } catch(err){

      console.log(err)
      res.send(err);
    }

});

router.put('/:id', async (req, res)=>{


  try {

    const findUpdatedArticle = Article.findByIdAndUpdate(req.params.id, req.body, {new: true});

    const findFoundAuthor = Author.findOne({'articles._id': req.params.id });

    // For running pararrell async taks
    const [updatedArticle, foundAuthor ] = await Promise.all([findUpdatedArticle, findFoundAuthor])

    if(foundAuthor._id.toString() != req.body.authorId){
          foundAuthor.articles.id(req.params.id).remove();

          await foundAuthor.save();
          const newAuthor = await Author.findById(req.body.authorId);
          newAuthor.articles.push(updatedArticle);

          const savedNewAuthor = await newAuthor.save();
          // if you want to go back to the show page you can do something like this
          res.redirect('/articles/' + req.params.id)


    } else {

          foundAuthor.articles.id(req.params.id).remove();
          // push new one
          foundAuthor.articles.push(updatedArticle);
          // save the updated author to database
          await foundAuthor.save()
          res.redirect('/articles/' + req.params.id);

    }


  } catch (err){
    res.send(err);
  }

});





module.exports = router;
