import express from 'express';
import { initialJwtVerify, jsonwebtokenVerify } from './../../middlewares/jwt';
import {
  initialAuthVerify,
  signUpController,
  logInController,
  logOutController,
} from './../../controllers/auth/auth';
const router = express.Router();

router.get('/', initialJwtVerify, initialAuthVerify);

router.post('/signup', signUpController);

router.post('/login', logInController);

router.get('/logout', jsonwebtokenVerify, logOutController);

export default router;
