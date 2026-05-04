import express from 'express';
import { getCurrentUser, updateAssistant, getAssistant } from '../controllers/user.controller.js';
import isAuth from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.get('/current',isAuth, getCurrentUser);
userRouter.post('/update',isAuth,upload.single('assistantImage'), updateAssistant);
userRouter.post('/gemini',isAuth, getAssistant);

export default userRouter;
