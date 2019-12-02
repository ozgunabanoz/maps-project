const uuid = require('uuid/v4');

const HttpError = require('../model/http-error');

const DUMMY_PLACES = [
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

const getPlaceByUserId = (req, res, next) => {
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

const createPlace = (req, res, next) => {
    const { title, description, coordinates, address, creator } = req.body;
    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };

    DUMMY_PLACES.push(createdPlace);
    res.status(201).json({ place: createdPlace });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
