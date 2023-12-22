// mainRouter.ts
import express from 'express';
import { Router } from 'express';
import bookRouter from './bookRouter';
import borrowerRouter from './borrowerRouter'
import borrowsRouter from './borrowsRouter'

const router: Router = express.Router();

router.use('/books', bookRouter);
router.use('/borrower', borrowerRouter)
router.use('/borrows', borrowsRouter)

export default router;