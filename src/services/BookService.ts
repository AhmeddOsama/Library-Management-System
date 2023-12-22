// bookService.ts
import { Repository } from 'typeorm';
import { dataSource } from '../../dataSources';
import { Book } from '../entities/Book';

interface BookDto {
    title: string,
    author: string,
    isbn: string,
    quantity: number
}
interface BookFilters {
    title?: string,
    author?: string,
    isbn?: string,
    quantity?: number
}
export class BookService {
    private readonly bookRepository: Repository<Book>;

    constructor() {
        this.bookRepository = dataSource.getRepository(Book);
    }

    async createBook(body: Book): Promise<Book> {
        console.log('creating')
        const newBook = this.bookRepository.create(body);

        return await this.bookRepository.insert(newBook).then(() => newBook);
    }

    async getBookByIsbn(isbn: string): Promise<Book> {
        const book = await this.bookRepository.findOneOrFail({
            where: {
                isbn: isbn
            },
        });


        return book;
    }

    async listAllBooks(): Promise<Book[]> {
        const books = await this.bookRepository.find();

        return books;
    }

    async searchBook(filters: Record<string, any>): Promise<Book[]> {
        const query = this.bookRepository.createQueryBuilder('book');
        for (const [key, value] of Object.entries(filters)) {
            query.andWhere(`book.${key} LIKE :${key}`, { [key]: `%${value}%` });
        }
        const books = await query.getMany();
        return books;
    }
    async deleteBook(isbn: string): Promise<void> {
        const book = await this.bookRepository.findOneOrFail({
            where: {
                isbn: isbn
            }
        });
        await this.bookRepository.remove(book);
    }
    async updateBook(isbn: string, updatedDetails: Partial<Book>): Promise<Book> {
        const book = await this.bookRepository.findOneOrFail({
            where: {
                isbn: isbn
            }
        });

        const updatedBook = await this.bookRepository.save({
            ...book,
            ...updatedDetails,
        });

        return updatedBook;
    }
}