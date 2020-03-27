import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UserPlaces = props => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const {
    isLoading,
    error,
    sendRequest,
    clearError
  } = useHttpClient();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/places/user/${userId}`
        );

        setLoadedPlaces(responseData.places);
      } catch (err) {}
    };

    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = deletedPlaceId => {
    setLoadedPlaces(prevPlaces =>
      prevPlaces.filter(place => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
      {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
      {!isLoading && loadedPlaces && (
        <PlaceList
          items={loadedPlaces}
          onDelete={placeDeletedHandler}
        ></PlaceList>
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
