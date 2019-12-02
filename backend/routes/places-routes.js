const express = require('express');

const placesControllers = require('../controllers/places-controller');

const router = express.Router();

router.get('/:placeId', placesControllers.getPlaceById);

router.get('/user/:userId', placesControllers.getPlaceByUserId);

module.exports = router;
