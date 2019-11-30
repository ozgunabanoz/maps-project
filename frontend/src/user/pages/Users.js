import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
    const USERS = [
        {
            id: 'u1',
            name: 'Ozgun Abanoz',
            image:
                'https://d2779tscntxxsw.cloudfront.net/5a1d9c9dc027b.png?width=1200&quality=80',
            places: 3
        }
    ];

    return <UsersList items={USERS}></UsersList>;
};

export default Users;
