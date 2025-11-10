import express from 'express';
import {
  verifyRecaptcha,
  register,
  login,
  logout,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post('/verify-recaptcha', verifyRecaptcha);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/reset-password', resetPassword);

export default router;