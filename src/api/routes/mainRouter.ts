// mainRouter.ts
import express from 'express';
import { Router } from 'express';
import bookRouter from './bookRouter';
import borrowerRouter from './borrowerRouter'
import borrowsRouter from './borrowsRouter'
import reportsRouter from './reportsRouter'

import authRouter from './authRoute'
import authenticateJWT from '../../middlewares/authenticateJWT';
const router: Router = express.Router();

router.use('/auth', authRouter);
router.use(authenticateJWT);

router.use('/books', bookRouter);
router.use('/borrower', borrowerRouter)
router.use('/borrows', borrowsRouter)
router.use('/reports', reportsRouter)


export default router;