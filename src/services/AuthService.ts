// bookService.ts
import { Repository } from 'typeorm';
import { dataSource } from '../../dataSources';
import { Borrower } from '../entities/Borrower';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface LoginBody {
    email: string,
    password: string,

}

export class AuthService {
    private readonly borrowerRepository: Repository<Borrower>;

    constructor() {
        this.borrowerRepository = dataSource.getRepository(Borrower);
    }


    async getToken(req: LoginBody): Promise<string> {
        const { email, password } = req
        const borrower = await this.borrowerRepository.findOneOrFail({
            where: {
                email: email
            }
        });
        const passwordMatch = await bcrypt.compare(password, borrower.password);
        if (!passwordMatch) {
            throw new Error('Invalid email or password');
        }


        const token = jwt.sign({ email }, "temp-secret", { expiresIn: '1h', algorithm: 'HS256' }); //key should be in a .env file
        return token
    };
}