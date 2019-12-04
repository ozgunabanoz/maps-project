import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import './PlaceForm.css';
import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
    VALIDATOR_REQUIRE,
    VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

const NewPlace = () => {
    const auth = useContext(AuthContext);
    const { error, sendRequest, clearError, isLoading } = useHttpClient();
    const [formState, inputHandler] = useForm(
        {
            title: {
                value: '',
                isValid: false
            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            }
        },
        false
    );

    const history = useHistory();

    const placeSubmitHandler = async event => {
        event.preventDefault();

        try {
            await sendRequest(
                'http://localhost:5000/api/places/',
                'POST',
                JSON.stringify({
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value,
                    address: formState.inputs.address.value,
                    creator: auth.userId
                }),
                { 'Content-Type': 'application/json' }
            );

            history.push('/');
        } catch (err) {}
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}></ErrorModal>
            <form className="place-form" onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
                <Input
                    id="title"
                    element="input"
                    type="text"
                    label="Title"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid title."
                    onInput={inputHandler}
                ></Input>
                <Input
                    id="description"
                    element="textarea"
                    type="text"
                    label="Description"
                    validators={[VALIDATOR_MINLENGTH(5)]}
                    errorText="Please enter a valid description (at least 5 characters)."
                    onInput={inputHandler}
                ></Input>
                <Input
                    id="address"
                    element="input"
                    type="text"
                    label="Address"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a valid address."
                    onInput={inputHandler}
                ></Input>
                <Button type="submit" disabled={!formState.isValid}>
                    ADD PLACE
                </Button>
            </form>
        </React.Fragment>
    );
};

export default NewPlace;
