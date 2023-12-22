import { Request, Response, NextFunction } from 'express';

interface ValidQueryKeys {
    allowedColumns: string[];
}

export function validateQueryParams(validKeys: ValidQueryKeys): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
        const queryParams = req.query;

        for (const key in queryParams) {
            if (!validKeys.allowedColumns.includes(key)) {
                res.status(400).json({ error: 'Invalid query parameters' });
                return;
            }
        }

        next();
    };
}
