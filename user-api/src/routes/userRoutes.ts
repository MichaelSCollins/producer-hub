import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.post('/register', (req, res) => {
    console.log(`[user-api] Handling POST /register`);
    if (!req.is('application/json'))
    {
        console.log(`[user-api] Invalid content type`);
        return res.status(400).json({ message: 'Invalid content type. Expected application/json' });
    }
    const { username, password } = req.body;
    if (!username || !password)
    {
        console.log(`[user-api] Missing username or password`);
        return res.status(400).json({ message: 'Username and password are required' });
    }
    console.log(`[user-api] User registered successfully: ${username}`);
    res.status(201).json({ message: 'User registered successfully', data: { username } });
});


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
