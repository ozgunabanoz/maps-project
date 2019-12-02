const uuid = require('uuid/v4');

const HttpError = require('../model/http-error');

let DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Ozgun Abanoz',
        email: 'bla@bla.com',
        password: 'sdasdasdasda'
    }
];

const getUsers = (req, res, next) => {
    res.status(200).send({ users: DUMMY_USERS });
};

const signUp = (req, res, next) => {
    const { name, email, password } = req.body;
    const createdUser = { id: uuid(), name, email, password };

    DUMMY_USERS.push(createdUser);
    res.status(200).json({ user: createdUser });
};

const logIn = (req, res, next) => {
    const { email, password } = req.body;
    const user = DUMMY_USERS.find(p => p.email === email);

    if (!user || user.password !== password) {
        throw new HttpError(
            'Could not identify user. Credentials seem to be wrong.',
            401
        );
    }

    res.status(200).json({ user });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.logIn = logIn;
