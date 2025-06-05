import express from 'express';
import { authUser, registerUser, verifyOtp, getMe, updateProfile, loginWithOtp, resendOtp, forgotPassword, resetPassword } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', authUser);
router.post('/login-otp', loginWithOtp);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router; 