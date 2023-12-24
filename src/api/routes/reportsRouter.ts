// bookRouter.ts
import express from 'express';
import { ReportsController } from '../controllers/ReportsController';
import { validateQueryParams } from '../../middlewares/validateQueryParams'; // Import the middleware
const allowedFilters = ['startDate', 'endDate', 'filetype'];

const analyseBorrowQueryParams = validateQueryParams({
    allowedColumns: allowedFilters,
});
const lastMonthBorrowQueryParams = validateQueryParams({
    allowedColumns: ['filetype', 'overdue'],
});

const reportsController = new ReportsController();
const router = express.Router();


router.get('/analyse-borrow-count', analyseBorrowQueryParams, reportsController.generateAnalyticalReport.bind(reportsController));
router.get('/last-month-borrows', lastMonthBorrowQueryParams, reportsController.exportLastMonthBorrows.bind(reportsController));


export default router;
