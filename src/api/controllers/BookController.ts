import { Request, Response } from 'express';
import { BookService } from '../../services/BookService';
import { validateBody } from '../../decorators/validateRequestBody'
import Joi from 'joi';

const createBookBody = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    isbn: Joi.string().required(),
    quantity: Joi.number().required(),

})
const bookBody = Joi.object({
    title: Joi.string().optional(),
    author: Joi.string().optional(),
    isbn: Joi.string().required(),
    quantity: Joi.number().optional(),

})
export class BookController {
    private readonly bookService: BookService;

    constructor() {
        this.bookService = new BookService();
    }
    @validateBody(createBookBody)
    async createBook(req: Request, res: Response) {
        try {
            const book = await this.bookService.createBook(req.body);
            res.status(201).json(book);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    @validateBody(bookBody)
    async updateBook(req: Request, res: Response) {
        try {
            const book = await this.bookService.updateBook(req.params.isbn, req.body);
            res.status(200).json(book);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async deleteBook(req: Request, res: Response) {
        try {
            await this.bookService.deleteBook(req.params.isbn);
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async searchBook(req: Request, res: Response) {
        try {

            const books = await this.bookService.searchBook(req.query);
            res.status(200).json(books);
        } catch (error: any) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
