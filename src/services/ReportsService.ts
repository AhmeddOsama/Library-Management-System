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


}
