import React from 'react';

import './PlaceList.css';
import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';

const PlaceList = props => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found maybe create one?</h2>
          <Button to="/places/new">Share place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map(item => (
        <PlaceItem
          key={item.id}
          id={item.id}
          image={item.image}
          title={item.title}
          description={item.description}
          address={item.address}
          creatorId={item.creator}
          coordinates={item.location}
          onDelete={props.onDelete}
        ></PlaceItem>
      ))}
    </ul>
  );
};

export default PlaceList;
