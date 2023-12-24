// controllers/authController.ts
import { Request, Response } from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { validateBody } from '../../decorators/validateRequestBody';
import bcrypt from 'bcrypt';
import { AuthService } from '../../services/AuthService'
const loginBody = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(), // Include password validation here
})
export class AuthController {
    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }
    @validateBody(loginBody)
    async getToken(req: Request, res: Response) {
        try {
            const token = await this.authService.getToken(req.body);
            res.json({ token });
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    };
}
