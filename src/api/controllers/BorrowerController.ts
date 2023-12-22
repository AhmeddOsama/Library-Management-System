import { Request, Response } from 'express';
import { BorrowerService } from '../../services/BorrowerService';

export class BorrowerController {
    private readonly borrowerService: BorrowerService;

    constructor() {
        this.borrowerService = new BorrowerService();
    }

    async createBorrower(req: Request, res: Response) {
        try {
            const Borrower = await this.borrowerService.createBorrower(req.body);
            res.status(201).json(Borrower);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }


    async updateBorrower(req: Request, res: Response) {
        try {
            const Borrower = await this.borrowerService.updateBorrower(req.params.isbn, req.body);
            res.status(200).json(Borrower);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async deleteBorrower(req: Request, res: Response) {
        try {
            await this.borrowerService.deleteBorrower(req.params.isbn);
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async searchBorrower(req: Request, res: Response) {
        try {
            const Borrowers = await this.borrowerService.searchBorrower(req.query);
            res.status(200).json(Borrowers);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
