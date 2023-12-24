import { Request, Response } from 'express';
import { BorrowerService } from '../../services/BorrowerService';
import Joi from 'joi';
import { validateBody } from '../../decorators/validateRequestBody'

const createBorrowerBody = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(), // Include password validation here
})
const updateBorrowerBody = Joi.object({
    name: Joi.string().optional,
    email: Joi.string().email().required(),
})
export class BorrowerController {
    private readonly borrowerService: BorrowerService;

    constructor() {
        this.borrowerService = new BorrowerService();
    }

    @validateBody(createBorrowerBody)
    async createBorrower(req: Request, res: Response) {
        try {
            const Borrower = await this.borrowerService.createBorrower(req.body);
            res.status(201).json({
                message: "Borrower created successfully",
                data: Borrower,
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    @validateBody(updateBorrowerBody)
    async updateBorrower(req: Request, res: Response) {
        try {
            const Borrower = await this.borrowerService.updateBorrower(req.params.isbn, req.body);
            res.status(200).json({
                message: "Borrower updated successfully",
                data: Borrower,
            });
        } catch (error: any) {
            res.status(404).json({ message: 'Not Found' });
        }
    }

    async deleteBorrower(req: Request, res: Response) {
        try {
            await this.borrowerService.deleteBorrower(req.params.isbn);
            res.status(204).json({ message: 'Borrower deleted successfully' });
        } catch (error: any) {
            res.status(404).json({ message: 'Not Found' });
        }
    }

    async searchBorrower(req: Request, res: Response) {
        try {
            const Borrowers = await this.borrowerService.searchBorrower(req.query);
            res.status(200).json(Borrowers);
        } catch (error: any) {
            res.status(500).json({ message: " Internal Server Error" });
        }
    }
}
