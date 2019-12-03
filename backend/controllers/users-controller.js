const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../model/http-error');
const User = require('../model/user');

const getUsers = async (req, res, next) => {
    let users;

    try {
        users = await User.find({}, '-password');
    } catch (err) {
        return next(new HttpError('Could not find users'), 500);
    }

    res.status(200).json({
        users: users.map(user => user.toObject({ getters: true }))
    });
};

const signUp = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed. Please correct.', 422)
        );
    }

    const { name, email, password } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {
        return next(new HttpError('A problem occurred'), 500);
    }

    if (existingUser) {
        return next(
            new HttpError('User exists already. Please login instead.'),
            422
        );
    }

    const createdUser = new User({
        name,
        email,
        password,
        image:
            'https://d2779tscntxxsw.cloudfront.net/5a1d9c9dc027b.png?width=1200&quality=80',
        places: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        return next(new HttpError('Signing up failed. Please correct.', 500));
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const logIn = async (req, res, next) => {
    const { email, password } = req.body;
    let user;

    try {
        user = await User.findOne({ email: email });
    } catch (err) {
        return next(new HttpError('Login failed try again'), 422);
    }

    if (!user || user.password !== password) {
        return next(
            new HttpError(
                'Could not identify user. Credentials seem to be wrong.',
                401
            )
        );
    }

    res.status(200).json({ user: user.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.logIn = logIn;
