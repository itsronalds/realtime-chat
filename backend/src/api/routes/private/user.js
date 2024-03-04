import express from 'express';
import {
  getAccountDataController,
  findUserController,
  sendMessageController,
  getUserDataController,
} from './../../controllers/private/user';
import { jsonwebtokenVerify } from './../../middlewares/jwt';
const router = express.Router();

router.get('/user/data', jsonwebtokenVerify, getAccountDataController);

router.get('/user/find/:userFullname', jsonwebtokenVerify, findUserController);

router.post('/user/message/send', jsonwebtokenVerify, sendMessageController);

// Ruta para recuperar la data de un usuario cuando se require abrir un nuevo chat
router.post('/user/data/chat', jsonwebtokenVerify, getUserDataController);

export default router;
