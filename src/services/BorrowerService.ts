import { Repository } from 'typeorm';
import { dataSource } from '../../dataSources';
import { Borrower } from '../entities/Borrower';
import bcrypt from 'bcrypt';
import { type } from 'os';

interface BorrowerDTO {
    id: number;
    name: string;
    email: string;
    password: string;

}
interface UpdateBorrowerDetails {
    name?: string;
    email: string;
};

interface BorrowerFilters {
    id?: number;
    name?: string;
    email?: string;
    registered_date?: Date;
}
export class BorrowerService {
    private readonly borrowerRepository: Repository<Borrower>;

    constructor() {
        this.borrowerRepository = dataSource.getRepository(Borrower);
    }

    async createBorrower(body: BorrowerDTO): Promise<Borrower> {
        const hashedPassword = await this.hashPassword(body.password);
        const newBorrower = this.borrowerRepository.create({
            ...body,
            password: hashedPassword,
        });
        return await this.borrowerRepository.insert(newBorrower).then(() => newBorrower);
    }

    // async getBorrowerByEmail(email: string): Promise<Borrower> {
    //     const borrower = await this.borrowerRepository.findOneOrFail({
    //         where: {
    //             email: email
    //         },
    //     });
    //     return borrower;
    // }
    async searchBorrower(filters: Record<string, any>): Promise<Borrower[]> {
        const query = this.borrowerRepository.createQueryBuilder('borrower');
        for (const [key, value] of Object.entries(filters)) {
            query.andWhere(`borrower.${key} LIKE :${key}`, { [key]: `%${value}%` });
        }
        const borrowers = await query.getMany();
        return borrowers;
    }
    async deleteBorrower(email: string): Promise<void> {
        const borrower = await this.borrowerRepository.findOneOrFail({
            where: {
                email: email
            }
        });
        await this.borrowerRepository.remove(borrower);
    }
    async updateBorrower(email: string, updatedDetails: UpdateBorrowerDetails): Promise<Borrower> {
        const borrower = await this.borrowerRepository.findOneOrFail({
            where: {
                email: email
            }
        });

        const updatedBorrower = await this.borrowerRepository.save({
            ...borrower,
            ...updatedDetails,
        });

        return updatedBorrower;
    }
    private async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

}