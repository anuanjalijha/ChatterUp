// Manage routes/paths to ProductController

// 1. Import express.
import express from 'express';
import UserController from './user.controller.js';
import { upload } from './middlewares/fileUpload.middleware.js';

// 2. Initialize Express router.
const userRouter = express.Router();

const userController = new UserController();

// All the paths to controller methods.

userRouter.post('/signup', upload.single('imageUrl'), (req, res, next) => {
    userController.signUp(req, res, next);
});

userRouter.post('/signin', (req, res) => {
    userController.signIn(req, res);
});

export default userRouter;
