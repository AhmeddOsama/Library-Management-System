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

    async returnBorrow(req: Request, res: Response) {
        try {
            const borrowId = parseInt(req.params.borrowId, 10);

            if (isNaN(borrowId)) {
                return res.status(400).json({ message: 'Invalid borrow id' });
            }

            const borrow = await this.borrowsService.returnBorrow(borrowId);
            res.status(200).json(borrow);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }


    // async deleteBorrow(req: Request, res: Response) {
    //     try {
    //         await this.borrowsService.deleteBorrow(req.params.id);
    //         res.status(204).send();
    //     } catch (error: any) {
    //         res.status(404).json({ message: error.message });
    //     }
    // }

    async searchBorrows(req: Request, res: Response) {
        try {
            const { isbn, email, checkoutDate, dueDate } = req.query;
            console.log(req.query)
            const borrows = await this.borrowsService.searchBorrows(
                {
                    isbn: isbn as string | undefined,
                    user_email: email as string,
                    checkoutDate: checkoutDate as Date | undefined,
                    dueDate: dueDate as Date | undefined,
                });
            res.status(200).json(borrows);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
