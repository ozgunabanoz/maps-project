import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the famous skyscrapers in the world',
        imageUrl:
            'https://handluggageonly.co.uk/wp-content/uploads/2015/10/How-To-Get-The-Most-Out-Of-Your-Time-In-New-York-City_-9.jpg',
        address: '20 W 34th St, New York, NY 10001, United States',
        location: { lat: 40.7484405, lng: -73.9856644 },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the famous skyscrapers in the world',
        imageUrl:
            'https://handluggageonly.co.uk/wp-content/uploads/2015/10/How-To-Get-The-Most-Out-Of-Your-Time-In-New-York-City_-9.jpg',
        address: '20 W 34th St, New York, NY 10001, United States',
        location: { lat: 40.7484405, lng: -73.9856644 },
        creator: 'u2'
    }
];

const UserPlaces = props => {
    const userId = useParams().userId;
    const loadedPlaces = DUMMY_PLACES.filter(place => place.creator === userId);

    return <PlaceList items={loadedPlaces}></PlaceList>;
};

export default UserPlaces;
