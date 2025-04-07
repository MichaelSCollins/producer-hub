import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

// Register a new user
router.post('/register', userController.register);

// Login a user
router.post('/login', userController.login);

// Update user settings
router.put('/settings', userController.updateSettings);

// Search for users
router.get('/user', userController.getUser);

// Search for users
router.get('/search', userController.searchUsers);

// Search for users
router.get('/healthcheck', userController.searchUsers);

export default router;
