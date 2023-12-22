import { Repository } from 'typeorm';
import { dataSource } from '../../dataSources';
import { Borrower } from '../entities/Borrower';
import { Borrows } from '../entities/Borrows';

interface BorrowDto {
    bookIsbn: string;
    borrowerId: number;
    checkoutDate: Date;
    dueDate: Date;
}

interface BorrowFilters {
    bookIsbn: string;
    borrowerId: number;
    checkoutDate: Date;
    dueDate: Date;
}

export class BorrowsService {
    private readonly borrowsRepository: Repository<Borrows>;
    private readonly borrowerRepository: Repository<Borrower>;

    constructor() {
        this.borrowsRepository = dataSource.getRepository(Borrows);
        this.borrowerRepository = dataSource.getRepository(Borrower);
    }

    async createBorrow(body: Borrows): Promise<Borrows> {
        console.log('borrow ')
        const newBorrow = this.borrowsRepository.create(body);
        return await this.borrowsRepository.insert(newBorrow).then(() => newBorrow);
    }

    async getBorrowsByBorrower(email: string): Promise<Borrows[]> {
        const borrower = await this.borrowerRepository.findOneOrFail({ where: { email } });
        return this.borrowsRepository.find({
            where: {
                borrower: borrower,
            },
        });
    }

    async searchBorrows(filters: Record<string, any>): Promise<Borrows[]> {
        const query = this.borrowsRepository.createQueryBuilder('borrow');
        for (const [key, value] of Object.entries(filters)) {
            query.andWhere(`borrow.${key} = :${key}`, { [key]: value });
        }
        return query.getMany();
    }

    async deleteBorrow(isbn: string): Promise<void> {
        const borrow = await this.borrowsRepository.findOneOrFail({
            where: {
                book: {
                    isbn: isbn,
                },
            },
        });
        await this.borrowsRepository.remove(borrow);
    }

    async updateBorrow(isbn: string, updatedDetails: Partial<BorrowDto>): Promise<Borrows> {
        const borrow = await this.borrowsRepository.findOneOrFail({
            where: {
                book: {
                    isbn: isbn,
                },
            },
        });

        const updatedBorrow = await this.borrowsRepository.save({
            ...borrow,
            ...updatedDetails,
        });

        return updatedBorrow;
    }
}
