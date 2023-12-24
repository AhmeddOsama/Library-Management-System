// bookRouter.ts
import express from 'express';
import { ReportsController } from '../controllers/ReportsController';

const reportsController = new ReportsController();
const router = express.Router();


router.get('/analyse-borrow-count', reportsController.generateAnalyticalReport.bind(reportsController));
router.get('/last-month-borrows', reportsController.exportLastMonthBorrows.bind(reportsController));


export default router;
