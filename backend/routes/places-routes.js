const express = require('express');

const router = express.Router();

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

router.get('/:placeId', (req, res, next) => {
    let place = DUMMY_PLACES.find(p => p.id === req.params.placeId);

    res.json({ place });
});

router.get('/user/:userId', (req, res, next) => {
    let places = DUMMY_PLACES.filter(p => p.creator === req.params.userId);

    res.json({ places });
});

module.exports = router;
