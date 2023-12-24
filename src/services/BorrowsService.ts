import { Like, MoreThan, Repository } from 'typeorm';
import { dataSource } from '../../dataSources';
import { Book } from '../entities/Book';
import { Borrower } from '../entities/Borrower';
import { Borrows } from '../entities/Borrows';

interface BorrowDto {
    isbn: string;
    user_email: string;
    checkoutDate: Date;
    dueDate: Date;
}

interface BorrowFilters {
    isbn?: string;
    user_email: string;
    checkoutDate?: Date;
    dueDate?: Date;
    returned?: boolean
}

export class BorrowsService {
    private readonly borrowsRepository: Repository<Borrows>;
    private readonly borrowerRepository: Repository<Borrower>;
    private readonly bookRepository: Repository<Book>

    constructor() {
        this.borrowsRepository = dataSource.getRepository(Borrows);
        this.borrowerRepository = dataSource.getRepository(Borrower);
        this.bookRepository = dataSource.getRepository(Book);

    }
    async createBorrow(body: BorrowDto): Promise<Borrows> {
        const { isbn, user_email, checkoutDate, dueDate } = body;

        // Start a transaction
        return dataSource.transaction(async (transactionalEntityManager) => {
            const book = await transactionalEntityManager.findOneOrFail(Book, {
                where: {
                    isbn: isbn,
                    quantity: MoreThan(0),
                },
            });

            const borrower = await transactionalEntityManager.findOneOrFail(Borrower, {
                where: {
                    email: user_email,
                },
            });

            const existingBorrow = await transactionalEntityManager.findOne(Borrows, {
                where: {
                    borrower: borrower,
                    book: { isbn: isbn },
                    due_date: MoreThan(checkoutDate),
                    returned: false,
                },
            });

            if (existingBorrow) {
                throw new Error('Borrower already has the same book on loan.');
            }

            book.quantity -= 1;
            await transactionalEntityManager.save(Book, book);

            const newBorrow = transactionalEntityManager.create(Borrows, {
                book: book,
                borrower: borrower,
                checkout_date: checkoutDate,
                due_date: dueDate,
            });

            await transactionalEntityManager.save(Borrows, newBorrow);

            return newBorrow;
        });
    }

    async getBorrowsByBorrower(email: string): Promise<Borrows[]> {
        try {
            const borrower = await this.borrowerRepository.findOneOrFail({ where: { email } });
            const borrows = await this.borrowsRepository.find({
                where: {
                    borrower: borrower,
                },
            });
            return borrows;
        } catch (error) {
            throw new Error(`Unable to find borrows for borrower with email: ${email}`);
        }
    }

    async searchBorrows(filters: BorrowFilters): Promise<Borrows[]> {
        let book = undefined
        const borrower = await this.borrowerRepository.findOneOrFail({ where: { email: filters.user_email } });
        if (filters.isbn) {
            book = await this.bookRepository.findOneOrFail({
                where: {
                    isbn: Like(filters.isbn),
                },
            });
        }
        const borrows = await this.borrowsRepository.find({
            where: {
                borrower: borrower,
                book: book,
                returned: false
            },
            relations: ['borrower', 'book'],
        });
        return borrows
    }

    // async deleteBorrow(isbn: string): Promise<void> {
    //     const borrow = await this.borrowsRepository.findOneOrFail({
    //         where: {
    //             book: {
    //                 isbn: isbn,
    //             },
    //         },
    //     });
    //     await this.borrowsRepository.remove(borrow);
    // }

    async returnBorrow(borrowId: number): Promise<Borrows> {
        const borrow = await this.borrowsRepository.findOneOrFail({
            where: {
                id: borrowId
            }
        });
        borrow.returned = true;
        const updatedBorrow = await this.borrowsRepository.save({
            ...borrow,
        });
        return updatedBorrow;
    }
}
