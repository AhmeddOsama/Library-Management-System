// borrowsController.ts
import { Request, Response } from 'express';
import { ReportService } from '../../services/ReportsService';
import { validateBody } from '../../decorators/validateRequestBody'
import Joi from 'joi'
import { convertToFormat } from '../../utils/utils';
import * as moment from 'moment';

const generateAnalyticalReportBody = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    filetype: Joi.string().valid('csv', 'xlsx').required(),
})
const filetype = Joi.object({
    filetype: Joi.string().valid('csv', 'xlsx').required(),
    overdue: Joi.boolean().optional()
})

export class ReportsController {
    private readonly reportsService: ReportService;

    constructor() {
        this.reportsService = new ReportService();
    }

    async generateAnalyticalReport(req: Request, res: Response) {
        try {
            const { startDate, endDate, filetype } = req.query

            if (filetype !== 'csv' && filetype !== 'xlsx') {
                return res.status(400).json({ error: 'Invalid query parameters' });

            }
            const parsedStartDate = new Date(startDate as string)
            const parsedEndDate = new Date(endDate as string)


            if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
                return res.status(400).json({ error: 'Invalid query parameters' });
            }

            const validFiletype = filetype as 'csv' | 'xlsx';

            const borrows = await this.reportsService.generateAnalyticalReport({ startDate: parsedStartDate, endDate: parsedEndDate });
            if (borrows.length == 0) {
                return res.status(404).json({ message: "No Borrows" })
            }
            const report = await convertToFormat(borrows, validFiletype, res)

            res.status(201).send(report);
        } catch (error: any) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async exportLastMonthBorrows(req: Request, res: Response) {
        try {
            const { filetype, overdue } = req.query
            if (filetype !== 'csv' && filetype !== 'xlsx') {
                return res.status(400).json({ error: 'Invalid query parameters' });

            }
            const isOverdue = overdue === 'true';
            const validFiletype = filetype as 'csv' | 'xlsx';

            const borrows = await this.reportsService.exportLastMonthBorrows(isOverdue);
            if (borrows.length == 0) {
                res.status(404).json({ message: "No Borrows" })
            }
            else {
                const report = await convertToFormat(borrows, validFiletype, res)
                res.status(201).send(report);
            }

        } catch (error: any) {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
