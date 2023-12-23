// middleware/authenticateJWT.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = 'temp-secret';

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const header = req.header('Authorization');
    if (!header) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = header.split(' ')[1]

    jwt.verify(token, jwtSecret, (err: any, user: any) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    });
};

export default authenticateJWT;
