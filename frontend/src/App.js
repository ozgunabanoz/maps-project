import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';

const App = () => {
    return (
        <Router>
            <MainNavigation></MainNavigation>
            <main>
                <Switch>
                    <Route path="/" exact>
                        <Users />
                    </Route>
                    <Route path="/:userId/places">
                        <UserPlaces></UserPlaces>
                    </Route>
                    <Route path="/places/new" exact>
                        <NewPlace />
                    </Route>
                    <Route path="/places/:placeId">
                        <UpdatePlace></UpdatePlace>
                    </Route>
                    <Route path="/auth">
                        <Auth></Auth>
                    </Route>
                    <Redirect to="/" />
                </Switch>
            </main>
        </Router>
    );
};

export default App;
