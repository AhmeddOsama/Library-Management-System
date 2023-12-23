// mainRouter.ts
import express from 'express';
import { Router } from 'express';
import bookRouter from './bookRouter';
import borrowerRouter from './borrowerRouter'
import borrowsRouter from './borrowsRouter'
import authRouter from './authRoute'
import authenticateJWT from '../../middlewares/authenticateJwt';
const router: Router = express.Router();

router.use('/auth', authRouter);
router.use(authenticateJWT);

router.use('/books', bookRouter);
router.use('/borrower', borrowerRouter)
router.use('/borrows', borrowsRouter)

export default router;