import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Users = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        const sendRequest = async () => {
            setIsLoading(true);

            try {
                const response = await fetch(
                    'http://localhost:5000/api/users/'
                );
                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message);
                }

                setLoadedUsers(responseData.users);
                setIsLoading(false);
            } catch (err) {
                setIsError(err.message);
            }

            setIsLoading(false);
        };

        sendRequest();
    }, []);

    const errorHandler = () => {
        setIsError(null);
    };

    return (
        <React.Fragment>
            <ErrorModal error={isError} onClear={errorHandler}></ErrorModal>
            {isLoading && (
                <div className="center">
                    <LoadingSpinner></LoadingSpinner>
                </div>
            )}
            {!isLoading && loadedUsers && (
                <UsersList items={loadedUsers}></UsersList>
            )}
        </React.Fragment>
    );
};

export default Users;
