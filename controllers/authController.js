const User = require('../models/User');
const { BadRequestError, UnauthenticatedError } = require('../errors/index');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Check if email or username already exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new BadRequestError('Email already exists');
  }

  const usernameExists = await User.findOne({ username });
  if (usernameExists) {
    throw new BadRequestError('Username already exists');
  }

  const user = await User.create({ username, email, password });
  const token = user.createJWT(); // Using the method defined on the User model
  
  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'User registered successfully',
    data: {
      token
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials');
  }

  const token = user.createJWT();
  res.status(200).json({ 
    success: true,
    statusCode: 200,
    message: 'User login successfully',
    data: {
      token
    },
  });
};

module.exports = { register, login };