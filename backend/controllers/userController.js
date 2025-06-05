import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import transporter from '../config/email.js';
import crypto from 'crypto';
import Joi from 'joi';

// Generate JWT
const generateToken = (id, name, email) => {
  return jwt.sign({ id, name, email }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Generate OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP Email
const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  });
};

// Validation Schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  newPassword: Joi.string().min(6).max(128).required(),
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        res.status(401);
        throw new Error('Please verify your email first');
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id, user.name, user.email),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const otp = generateOtp();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false,
      otp,
      otpExpires,
    });
    await sendOtpEmail(email, otp);
    res.status(201).json({ message: 'OTP sent to email. Please verify.' });
  } catch (error) {
    next(error);
  }
};

// Verify OTP
const verifyOtp = async (req, res, next) => {
  try {
    const { error } = otpSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error('User not found');
    }
    if (user.isVerified) {
      res.status(400);
      throw new Error('User already verified');
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({
      token: generateToken(user._id, user.name, user.email),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login with OTP
const loginWithOtp = async (req, res, next) => {
  try {
    const { error } = otpSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error('User not found');
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({
      token: generateToken(user._id, user.name, user.email),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Resend OTP
const resendOtp = async (req, res, next) => {
  try {
    const { error } = Joi.object({ email: Joi.string().email().required() }).validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error('User not found');
    }
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP resent to email.' });
  } catch (error) {
    next(error);
  }
};

// Forgot Password (send OTP)
const forgotPassword = async (req, res, next) => {
  try {
    const { error } = Joi.object({ email: Joi.string().email().required() }).validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error('User not found');
    }
    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();
    await sendOtpEmail(email, otp);
    res.json({ message: 'OTP sent to email for password reset.' });
  } catch (error) {
    next(error);
  }
};

// Reset Password (verify OTP and set new password)
const resetPassword = async (req, res, next) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      res.status(400);
      throw new Error(error.details[0].message);
    }
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400);
      throw new Error('User not found');
    }
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    next(error);
  }
};

export { authUser, registerUser, verifyOtp, loginWithOtp, getMe, updateProfile, resendOtp, forgotPassword, resetPassword }; 