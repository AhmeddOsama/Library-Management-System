// bookRouter.ts
import express from 'express';
import { BookController } from '../controllers/BookController';
import { validateQueryParams } from '../../middlewares/validateQueryParams'; // Import the middleware
import rateLimitMiddleware from '../../middlewares/rateLimiter'
const bookController = new BookController();
const router = express.Router();

const allowedBookFilters = ['title', 'author', 'isbn'];

const validateBookQueryParams = validateQueryParams({
    allowedColumns: allowedBookFilters,
});

router.post('/add', rateLimitMiddleware, bookController.createBook.bind(bookController));
router.put('update/:isbn', bookController.updateBook.bind(bookController));
router.delete('delete/:isbn', bookController.deleteBook.bind(bookController));
//Validate Query Params is used in routes where the query parameters are defined in the url
router.get('', rateLimitMiddleware, validateBookQueryParams, bookController.searchBook.bind(bookController));

export default router;
