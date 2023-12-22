// bookRouter.ts
import express from 'express';
import { BookController } from '../controllers/BookController';
import { validateQueryParams } from '../../middlewares/validateQueryParams'; // Import the middleware

const bookController = new BookController();
const router = express.Router();

const allowedBookFilters = ['title', 'author', 'isbn'];

const validateBookQueryParams = validateQueryParams({
    allowedColumns: allowedBookFilters,
});

router.post('/add', bookController.createBook.bind(bookController));
router.put('/:isbn', bookController.updateBook.bind(bookController));
router.delete('/:isbn', bookController.deleteBook.bind(bookController));

// Use the middleware in the searchBook route
router.get('', validateBookQueryParams, bookController.searchBook.bind(bookController));

export default router;
