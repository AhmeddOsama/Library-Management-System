// borrowsController.ts
import { Request, Response } from 'express';
import { ReportService } from '../../services/ReportsService';
import { validateBody } from '../../decorators/validateRequestBody'
import Joi from 'joi'
import { convertToFormat } from '../../utils/utils';

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

    @validateBody(generateAnalyticalReportBody)
    async generateAnalyticalReport(req: Request, res: Response) {
        try {
            const borrows = await this.reportsService.generateAnalyticalReport(req.body);
            const report = await convertToFormat(borrows, req.body.filetype, res)

            res.status(201).send(report);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    @validateBody(filetype)
    async exportLastMonthBorrows(req: Request, res: Response) {
        try {
            const borrows = await this.reportsService.exportLastMonthBorrows(req.body.overdue);
            if (borrows.length == 0) {
                res.status(201).json({ message: "No Borrows" })
            }
            else {
                const report = await convertToFormat(borrows, req.body.filetype, res)
                res.status(201).send(report);
            }

        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
