// borrowsController.ts
import { Request, Response } from 'express';
import { BorrowsService } from '../../services/BorrowsService';

export class BorrowsController {
    private readonly borrowsService: BorrowsService;

    constructor() {
        this.borrowsService = new BorrowsService();
    }

    async createBorrow(req: Request, res: Response) {
        try {
            const borrow = await this.borrowsService.createBorrow(req.body);
            res.status(201).json(borrow);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateBorrow(req: Request, res: Response) {
        try {
            const borrow = await this.borrowsService.updateBorrow(req.params.id, req.body);
            res.status(200).json(borrow);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async deleteBorrow(req: Request, res: Response) {
        try {
            await this.borrowsService.deleteBorrow(req.params.id);
            res.status(204).send();
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async searchBorrows(req: Request, res: Response) {
        try {
            const borrows = await this.borrowsService.searchBorrows(req.query);
            res.status(200).json(borrows);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
