import { Request, Response, NextFunction } from 'express';
import Joi, { Schema } from 'joi';

const validateRequest = (schema: Schema, body: Record<string, any>): string | null => {
    const validationResult = schema.validate(body);
    return validationResult.error ? validationResult.error.message : null;
};

// Custom decorator for request body validation
export const validateBody = (schema: Schema) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor): void => {
        const originalMethod = descriptor.value;

        descriptor.value = async function (
            req: Request,
            res: Response,
            next: NextFunction
        ): Promise<void> {
            // console.log('helloo')
            const validationError = validateRequest(schema, req.body);
            if (validationError) {
                res.status(403).json({ message: validationError });
                return
            }

            //calling the original method
            await originalMethod.apply(this, [req, res, next]);
        };
    };
};
