import React, { useState, useCallback } from 'react';
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
import { AuthContext } from './shared/context/auth-context';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(false);

    const login = useCallback(uid => {
        setIsLoggedIn(true);
        setUserId(uid);
    }, []);
    const logout = useCallback(() => {
        setIsLoggedIn(false);
        setUserId(null);
    }, []);

    let routes;

    if (isLoggedIn) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users />
                </Route>
                <Route path="/:userId/places" exact>
                    <UserPlaces></UserPlaces>
                </Route>
                <Route path="/places/new" exact>
                    <NewPlace />
                </Route>
                <Route path="/places/:placeId">
                    <UpdatePlace></UpdatePlace>
                </Route>
                <Redirect to="/"></Redirect>
            </Switch>
        );
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users />
                </Route>
                <Route path="/:userId/places" exact>
                    <UserPlaces></UserPlaces>
                </Route>
                <Route path="/auth">
                    <Auth></Auth>
                </Route>
                <Redirect to="/auth"></Redirect>
            </Switch>
        );
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn: isLoggedIn,
                userId: userId,
                login: login,
                logout: logout
            }}
        >
            <Router>
                <MainNavigation></MainNavigation>
                <main>{routes}</main>
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
