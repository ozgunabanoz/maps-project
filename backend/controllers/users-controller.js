const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(
      new HttpError('Could not create a user, please try again.', 500)
    );
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(
      new HttpError('Signing up failed. Please correct.', 500)
    );
  }

  let token;

  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (err) {
    return next(
      new HttpError('Signing up failed. Please correct.', 500)
    );
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    token: token
  });
};

const logIn = async (req, res, next) => {
  const { email, password } = req.body;
  let user;

  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError('Login failed try again'), 422);
  }

  if (!user) {
    return next(
      new HttpError(
        'Could not identify user. Credentials seem to be wrong.',
        401
      )
    );
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    return next(
      'Could not log you in, please check your credentials.',
      500
    );
  }

  if (!isValidPassword) {
    return next(
      'Could not log you in, please check your credentials.',
      403
    );
  }

  let token;

  try {
    token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (err) {
    return next(
      new HttpError('Logging in failed. Please correct.', 500)
    );
  }

  res
    .status(200)
    .json({ userId: user.id, email: user.email, token: token });
};

exports.getUsers = getUsers;
exports.signUp = signUp;
exports.logIn = logIn;
