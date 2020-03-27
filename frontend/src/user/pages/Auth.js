import React, { useState, useContext } from 'react';

import './Auth.css';
import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);

  const {
    isLoading,
    error,
    sendRequest,
    clearError
  } = useHttpClient();

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
        { ...formState.inputs, name: undefined, image: undefined },
        formState.inputs.email.isValid &&
          formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: { value: '', isValid: false },
          image: { value: null, isValid: false }
        },
        false
      );
    }

    setIsLogin(prevMode => !prevMode);
  };

  const authSubmitHandler = async event => {
    event.preventDefault();

    if (isLogin) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/users/login`,
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          { 'Content-Type': 'application/json' }
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else {
      try {
        const formData = new FormData();

        formData.append('email', formState.inputs.email.value);
        formData.append('name', formState.inputs.name.value);
        formData.append('password', formState.inputs.password.value);
        formData.append('image', formState.inputs.image.value);

        const responseData = await sendRequest(
          `${process.env.REACT_APP_API_URL}/users/signup`,
          'POST',
          formData
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}></ErrorModal>
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
          {!isLogin && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image."
            ></ImageUpload>
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
