const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json()); //for getting the post request data

app.use('/uploads/images', express.static(path.join('uploads','images')));

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-with,Content-Type,Accept,Authorization');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');
  next();
});



app.use('/api/places', placesRoutes); // => /api/places...
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});
//this will basically handle those errors which pass the wrong http request that doesn't exist..like: localhost/5000/robinkey

app.use((error, req, res, next) => {
  if(req.file){
     fs.unlink(req.file.path, (err)=>{
       console.log(err);
     })
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'});
});
//if any use have any error then this error will run.

mongoose.connect('mongodb+srv://robin:robin123456@cluster0.sobnu.mongodb.net/mern?retryWrites=true&w=majority')
.then(()=>{
  console.log("Connected!!!");
  app.listen(5000);
})
.catch((error) => {
  console.log("Error:"+error);
});
