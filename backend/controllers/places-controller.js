const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../model/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../model/place');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Bld',
        description: `World's one of the most famous skyscrapers`,
        imageUrl:
            'https://handluggageonly.co.uk/wp-content/uploads/2015/10/How-To-Get-The-Most-Out-Of-Your-Time-In-New-York-City_-9.jpg',
        address: '20 W 34th St, New York, NY 10001, United States',
        location: { lat: 40.7484405, lng: -73.9856644 },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Bld',
        description: `World's one of the most famous skyscrapers`,
        imageUrl:
            'https://handluggageonly.co.uk/wp-content/uploads/2015/10/How-To-Get-The-Most-Out-Of-Your-Time-In-New-York-City_-9.jpg',
        address: '20 W 34th St, New York, NY 10001, United States',
        location: { lat: 40.7484405, lng: -73.9856644 },
        creator: 'u1'
    }
];

const getPlaceById = (req, res, next) => {
    let place = DUMMY_PLACES.find(p => p.id === req.params.placeId);

    if (!place) {
        throw new HttpError(
            'Could not find a place for the provided place id.',
            404
        );
    }

    res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
    let places = DUMMY_PLACES.filter(p => p.creator === req.params.userId);

    if (places.length === 0) {
        return next(
            new HttpError(
                'Could not find a place for the provided user id.',
                404
            )
        );
    }

    res.json({ places });
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

    try {
        await createdPlace.save();
    } catch (err) {
        return next(
            new HttpError('Creating place failed. Please correct.', 500)
        );
    }

    res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        throw new HttpError('Invalid inputs passed. Please correct.', 422);
    }

    const { title, description } = req.body;
    const updatedPlace = {
        ...DUMMY_PLACES.find(p => p.id === req.params.placeId)
    };
    const placeIndex = DUMMY_PLACES.findIndex(p => p.id === req.params.placeId);

    updatedPlace.title = title;
    updatedPlace.description = description;
    DUMMY_PLACES[placeIndex] = updatedPlace;
    res.status(200).json({ place: updatedPlace });
};

const deletePlace = (req, res, next) => {
    if (!DUMMY_PLACES.find(p => p.id === req.params.placeId)) {
        throw new HttpError('Could not find a place for that id.', 404);
    }

    DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== req.params.placeId);
    res.status(200).send({ places: DUMMY_PLACES });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
