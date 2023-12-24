// middleware/authenticateJWT.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const jwtSecret = 'temp-secret';

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, jwtSecret, (err: any, email: any) => {
        // console.log('email', email)
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    });
};

export default authenticateJWT;
