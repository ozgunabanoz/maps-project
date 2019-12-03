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
            new HttpError('Something went wrong, could not find a place.', 500)
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
    let places;

    try {
        places = await Place.find({ creator: userId });
    } catch (err) {
        return next(
            new HttpError(
                'Something went wrong, could not find any place.',
                404
            )
        );
    }

    if (places.length === 0) {
        return next(
            new HttpError(
                'Could not find a place for the provided user id.',
                404
            )
        );
    }

    res.json({
        places: places.map(place => place.toObject({ getters: true }))
    });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed. Please correct.', 422)
        );
    }

    const { title, description, address, creator } = req.body;
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
        image:
            'https://handluggageonly.co.uk/wp-content/uploads/2015/10/How-To-Get-The-Most-Out-Of-Your-Time-In-New-York-City_-9.jpg',
        creator
    });

    let user;

    try {
        user = await User.findById(creator);
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
    let updatedPlace;

    try {
        updatedPlace = await Place.findOneAndUpdate(
            { _id: placeId },
            { $set: { title, description } },
            { new: true }
        );
    } catch (err) {
        return next(new HttpError('Could not find the place'), 500);
    }

    res.status(200).json({ place: updatedPlace.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
    const placeId = req.params.placeId;
    let deletedPlace;

    try {
        deletedPlace = await Place.findOneAndRemove({ _id: placeId });
    } catch (err) {
        return next(new HttpError('Could not find the place'), 500);
    }

    res.status(200).send({
        place: deletedPlace.toObject({ getters: true }),
        message: 'Place deleted.'
    });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
