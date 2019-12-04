import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const UserPlaces = props => {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const userId = useParams().userId;

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/places/user/${userId}`
                );

                setLoadedPlaces(responseData.places);
            } catch (err) {}
        };

        fetchPlaces();
    }, [sendRequest, userId]);

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}></ErrorModal>
            {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
            {!isLoading && loadedPlaces && (
                <PlaceList items={loadedPlaces}></PlaceList>
            )}
        </React.Fragment>
    );
};

export default UserPlaces;
