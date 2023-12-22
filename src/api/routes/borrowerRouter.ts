import express from 'express';
import { BorrowerController } from '../controllers/BorrowerController';
import { validateQueryParams } from '../../middlewares/validateQueryParams'
const borrowerController = new BorrowerController();
const router = express.Router();

const allowedBorrowerFilters = ['name', 'email'];

const validateBorrowerQueryParams = validateQueryParams({
    allowedColumns: allowedBorrowerFilters,
});

router.post('/add', borrowerController.createBorrower.bind(borrowerController));
router.put('/:email', borrowerController.updateBorrower.bind(borrowerController));
router.delete('/:email', borrowerController.deleteBorrower.bind(borrowerController));
router.get('', validateBorrowerQueryParams, borrowerController.searchBorrower.bind(borrowerController));

export default router;
