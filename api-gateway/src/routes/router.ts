import express, { Express } from 'express';
import UserController from '../controllers/user';
const router = express.Router();

const useRouter = (app: Express) => {
    router.post('/login', UserController.login);
    router.post('/logout', UserController.logout)
    app.use('/api', router);
}

export default useRouter