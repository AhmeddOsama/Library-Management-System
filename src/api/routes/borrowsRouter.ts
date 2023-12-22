import express from 'express';
import { BorrowsController } from '../controllers/BorrowsController';
import { validateQueryParams } from '../../middlewares/validateQueryParams'
const borrowsController = new BorrowsController();
const router = express.Router();

const allowedBorrowsFilters = ['book', 'borrower'];

const validateBorrowerQueryParams = validateQueryParams({
    allowedColumns: allowedBorrowsFilters,
});

router.post('/add', borrowsController.createBorrow.bind(borrowsController));
router.put('/:email', borrowsController.updateBorrow.bind(borrowsController));
router.delete('/:email', borrowsController.deleteBorrow.bind(borrowsController));
router.get('', validateBorrowerQueryParams, borrowsController.searchBorrows.bind(borrowsController));

export default router;
