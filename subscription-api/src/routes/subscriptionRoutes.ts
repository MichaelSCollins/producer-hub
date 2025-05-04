import { Router } from 'express';
import { getByUserId, subscribeUser } from '../controllers/subscriptionController';

const router = Router();

router.get('/subscriptions/:userId', getByUserId as any);
router.post('/subscribe', subscribeUser as any);

export default router;
