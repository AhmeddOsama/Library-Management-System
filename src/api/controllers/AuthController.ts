// controllers/authController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export class AuthController {

    getToken = (req: Request, res: Response) => {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }


        const token = jwt.sign({ username }, "temp-secret", { expiresIn: '1h', algorithm: 'HS256' }); //key should be in a .env file
        res.json({ token });
    };
}
