const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const nodemailer = require('nodemailer')
require('dotenv/config');



//connect to db
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err) => {
    if (!err) {
      console.log('MongoDB Connection Succeeded.');
    } else {
      console.log('Error in DB connection : ' + err);
    }
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

const schoolRoutes = require('./routes/school');
app.use('/school', schoolRoutes);

const boardRoutes = require('./routes/board');
app.use('/board', boardRoutes);

//Routes
app.get('/',(req,res)=> {
    res.send('We are at Home directory')
})

console.log('application startup complete')

// How to start listening
app.listen(3001, () => console.log('Restarting node server ...'));
