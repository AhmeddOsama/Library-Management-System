import exceljs from 'exceljs';
import csvParser from 'csv-parser';
import { Response } from 'express';

export const convertToFormat = async (records: any[], format: 'csv' | 'xlsx', res: Response): Promise<string | exceljs.Buffer> => {
    if (format === 'csv') {
        const csvData: string[] = [];
        const columns = Object.keys(records[0]);
        const header = columns.join(',');
        csvData.push(header);

        records.forEach((record) => {
            const csvRecord = columns.map((column) => record[column]).join(',');
            csvData.push(csvRecord);
        });
        res.setHeader('Content-Type', 'text/csv');
        return csvData.join('\n');
    } else if (format === 'xlsx') {

        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');
        const columns = Object.keys(records[0]).map(key => ({
            header: key,
            key: key,
            width: 20,
        }));
        worksheet.columns = columns
        worksheet.addRows(records);
        const buffer = await workbook.xlsx.writeBuffer();
        res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx');
        return buffer
    } else {
        throw new Error('Unsupported format');
    }
};