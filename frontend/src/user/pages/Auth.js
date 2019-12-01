import React, { useState } from 'react';

import './Auth.css';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
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

    const authSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    };

    return (
        <Card className="authentication">
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
    );
};

export default Auth;
