import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validateRequest = (dtoClass: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log('Validation middleware - Incoming request body:', JSON.stringify(req.body, null, 2));
        const dtoObject = plainToClass(dtoClass, req.body);
        console.log('Validation middleware - Transformed DTO:', JSON.stringify(dtoObject, null, 2));

        const errors = await validate(dtoObject);
        console.log('Validation middleware - Validation errors:', JSON.stringify(errors, null, 2));

        if (errors.length > 0)
        {
            const errorMessages = errors.map(error => Object.values(error.constraints || {}));
            console.log('Validation middleware - Error messages:', errorMessages);
            return res.status(400).json({ errors: errorMessages });
        }

        req.body = dtoObject;
        next();
    };
}; 