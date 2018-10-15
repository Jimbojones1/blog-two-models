const express = require('express');
const app     = express();

require('./db/db');

const authorsController = require('./controllers/authors');

// setting up the middleware for our controller
// where every route will start with /authors
app.use('/authors', authorsController);

app.get('/', (req, res) => {
  res.render('index.ejs');
});


app.listen(3000, () => {
  console.log('listening on port 3000');
})
