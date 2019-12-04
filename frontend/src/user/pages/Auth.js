import React, { useState, useContext } from 'react';

import './Auth.css';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';

const Auth = () => {
    const auth = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [formState, inputHandler, setFormData] = useForm(
        {
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const switchModeHandler = () => {
        if (!isLogin) {
            setFormData(
                { ...formState.inputs, name: undefined },
                formState.inputs.email.isValid &&
                    formState.inputs.password.isValid
            );
        } else {
            setFormData(
                { ...formState.inputs, name: { value: '', isValid: false } },
                false
            );
        }

        setIsLogin(prevMode => !prevMode);
    };

    const authSubmitHandler = async event => {
        event.preventDefault();
        setIsLoading(true);

        if (isLogin) {
            let response;

            try {
                response = await fetch(
                    'http://localhost:5000/api/users/login',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: formState.inputs.email.value,
                            password: formState.inputs.password.value
                        })
                    }
                );

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message);
                }

                setIsLoading(false);
                auth.login();
            } catch (err) {
                setIsLoading(false);
                setError(
                    err.message || 'Something went wrong. Please try again.'
                );
            }
        } else {
            let response;

            try {
                response = await fetch(
                    'http://localhost:5000/api/users/signup',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: formState.inputs.name.value,
                            email: formState.inputs.email.value,
                            password: formState.inputs.password.value
                        })
                    }
                );

                const responseData = await response.json();

                if (!response.ok) {
                    throw new Error(responseData.message);
                }

                setIsLoading(false);
                auth.login();
            } catch (err) {
                setIsLoading(false);
                setError(
                    err.message || 'Something went wrong. Please try again.'
                );
            }
        }
    };

    const errorHandler = () => {
        setError(null);
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={errorHandler}></ErrorModal>
            <Card className="authentication">
                {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
                <h2>Login required</h2>
                <hr />
                <form onSubmit={authSubmitHandler}>
                    {!isLogin && (
                        <Input
                            element="input"
                            id="name"
                            type="text"
                            label="Your name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter a name"
                            onInput={inputHandler}
                        ></Input>
                    )}
                    <Input
                        element="input"
                        id="email"
                        type="email"
                        label="E-Mail"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email address."
                        onInput={inputHandler}
                    ></Input>
                    <Input
                        element="input"
                        id="password"
                        type="password"
                        label="Password"
                        validators={[VALIDATOR_MINLENGTH(8)]}
                        errorText="Please enter a valid password (at least 8 characters)."
                        onInput={inputHandler}
                    ></Input>
                    <Button type="submit" disabled={!formState.isValid}>
                        {isLogin ? 'LOG IN' : 'SIGN UP'}
                    </Button>
                </form>
                <Button inverse onClick={switchModeHandler}>
                    SWITCH TO {isLogin ? 'SIGN UP' : 'LOG IN'}
                </Button>
            </Card>
        </React.Fragment>
    );
};

export default Auth;
