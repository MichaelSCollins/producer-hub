// router.ts
import UserController from '../controllers/user';
import { Router } from 'express';

const router = Router();
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

export default router;
