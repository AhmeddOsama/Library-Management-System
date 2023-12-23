import express from 'express';
import { BorrowsController } from '../controllers/BorrowsController';
import { validateQueryParams } from '../../middlewares/validateQueryParams'
const borrowsController = new BorrowsController();
const router = express.Router();

const allowedBorrowsFilters = ['book', 'email'];

const validateBorrowerQueryParams = validateQueryParams({
    allowedColumns: allowedBorrowsFilters,
});

router.post('/add', borrowsController.createBorrow.bind(borrowsController));
router.put('/:email', borrowsController.returnBorrow.bind(borrowsController));
router.put('/return/:borrowId', borrowsController.returnBorrow.bind(borrowsController));

router.get('', validateBorrowerQueryParams, borrowsController.searchBorrows.bind(borrowsController));

export default router;
