import React from 'react';
import { useParams } from 'react-router-dom';

import './PlaceForm.css';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH
} from '../../shared/util/validators';

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

const UpdatePlace = () => {
    const placeId = useParams().placeId;
    const identifiedPlace = DUMMY_PLACES.find(p => p.id === placeId);

    if (!identifiedPlace) {
        return (
            <div className="center">
                <h2>Could not find the place</h2>
            </div>
        );
    }

    return (
        <form className="place-form">
            <Input
                id="title"
                element="input"
                type="text"
                label="Title"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title."
                onInput={() => {}}
                value={identifiedPlace.title}
                valid={true}
            ></Input>
            <Input
                id="description"
                element="textarea"
                type="text"
                label="Description"
                validators={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (minimum 5 characters)."
                onInput={() => {}}
                value={identifiedPlace.description}
                valid={true}
            ></Input>
            <Button type="submit" disabled={true}>
                UPDATE PLACE
            </Button>
        </form>
    );
};

export default UpdatePlace;
