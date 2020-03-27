require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const userRoutes = require('./routes/user-routes');
const HttpError = require('./model/http-error');

const app = express();

app.use(bodyParser.json());

app.use(
  '/uploads/images',
  express.static(path.join('uploads', 'images'))
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE'
  );
  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
  throw new HttpError('Could not find this route', 404);
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500).json({
    message: error.message || 'An unknown error occurred.'
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch(err => {
    console.log(err);
  });
