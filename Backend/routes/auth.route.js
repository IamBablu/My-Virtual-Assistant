import express from 'express';
import { Login, Logout, Singnup } from '../controllers/auth.controller.js';
const authRouter = express.Router()

authRouter.post("/signup", Singnup);
authRouter.post("/signin", Login);
authRouter.get("/signout", Logout);

export default authRouter;