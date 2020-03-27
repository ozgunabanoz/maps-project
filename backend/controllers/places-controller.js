const fs = require('fs');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../model/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../model/place');
const User = require('../model/user');

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError(
        'Something went wrong, could not find a place.',
        500
      )
    );
  }

  if (!place) {
    return next(
      new HttpError(
        'Could not find a place for the provided place id.',
        404
      )
    );
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let userWithPlaces;

  try {
    userWithPlaces = await User.findById(userId).populate('places');
  } catch (err) {
    return next(
      new HttpError(
        'Something went wrong, could not find any place.',
        404
      )
    );
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError(
        'Could not find a place for the provided user id.',
        404
      )
    );
  }

  res.json({
    places: userWithPlaces.places.map(place =>
      place.toObject({ getters: true })
    )
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed. Please correct.', 422)
    );
  }

  const { title, description, address } = req.body;
  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (err) {
    return next(err);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator: req.userData.userId
  });

  let user;

  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    return next(new HttpError('Creating place failed'), 500);
  }

  if (!user) {
    return next(
      new HttpError('Could not find the user for the provided id'),
      404
    );
  }

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(
      new HttpError('Creating place failed. Please correct.', 500)
    );
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed. Please correct.', 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.placeId;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    return next(
      new HttpError(
        'Something went wrong, could not update place.',
        500
      )
    );
  }

  if (place.creator.toString() !== req.userData.userId) {
    return next(
      new HttpError('You are not authorized to edit this place.', 401)
    );
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return next(
      new HttpError(
        'Something went wrong, could not update place.',
        500
      )
    );
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;

  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    return next(new HttpError('Could not find the place'), 500);
  }

  if (!place) {
    return next(
      new HttpError('Could not find the place for this id'),
      404
    );
  }

  if (place.creator.id !== req.userData.userId) {
    return next(
      new HttpError('You are not authorized to delete this place.'),
      401
    );
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();

    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError('An error occurred'), 500);
  }

  fs.unlink(imagePath, err => {
    console.log(err);
  });

  res.status(200).send({
    place: place.toObject({ getters: true }),
    message: 'Place deleted.'
  });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
