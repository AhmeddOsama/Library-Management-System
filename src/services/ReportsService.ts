// src/services/ReportService.ts
import { Between, Repository } from 'typeorm';
import { dataSource } from '../../dataSources';
import { Borrows } from '../entities/Borrows';
import { Borrower } from '../entities/Borrower';
import { Book } from '../entities/Book';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import * as excel from 'exceljs';
import { convertToFormat } from '../utils/utils';

interface ReportFilters {
    startDate: Date;
    endDate: Date;
}

export class ReportService {
    private readonly borrowsRepository: Repository<Borrows>;

    constructor() {
        this.borrowsRepository = dataSource.getRepository(Borrows);
    }

    async generateAnalyticalReport(filters: ReportFilters): Promise<any> {

        const borrows = await this.borrowsRepository
            .createQueryBuilder('borrows')
            .select(['book.title', 'COUNT(borrows.id) as borrow_count'])
            .leftJoin('borrows.book', 'book')
            .where(`borrows.checkout_date BETWEEN :startDate AND :endDate`, {
                startDate: filters.startDate,
                endDate: filters.endDate,
            })
            .groupBy('book.title')
            .getRawMany();

        return borrows
    }

    async exportBorrowingDataToCSV(filePath: string): Promise<void> {
        const borrows = await this.borrowsRepository.find();

        const csvStream = fs.createWriteStream(filePath);
        csvStream.write('Borrower Name,Book Title,Checkout Date,Due Date,Returned\n');

        borrows.forEach((borrow) => {
            const rowData = `${borrow.borrower.name},${borrow.book.title},${borrow.checkout_date},${borrow.due_date},${borrow.returned}\n`;
            csvStream.write(rowData);
        });

        csvStream.end();
    }

    async exportBorrowingDataToXlsx(filePath: string): Promise<void> {
        const borrows = await this.borrowsRepository.find();

        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet('Borrowing Data');

        worksheet.columns = [
            { header: 'Borrower Name', key: 'borrowerName', width: 20 },
            { header: 'Book Title', key: 'bookTitle', width: 30 },
            { header: 'Checkout Date', key: 'checkoutDate', width: 15 },
            { header: 'Due Date', key: 'dueDate', width: 15 },
            { header: 'Returned', key: 'returned', width: 10 },
        ];

        borrows.forEach((borrow) => {
            worksheet.addRow({
                borrowerName: borrow.borrower.name,
                bookTitle: borrow.book.title,
                checkoutDate: borrow.checkout_date.toISOString(),
                dueDate: borrow.due_date.toISOString(),
                returned: borrow.returned.toString(),
            });
        });

        await workbook.xlsx.writeFile(filePath);
    }
}
