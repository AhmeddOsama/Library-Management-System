import { rateLimit } from 'express-rate-limit';

const rateLimitMiddleware = rateLimit({
    windowMs: 60 * 1000,
    max: 0,
    message: 'Too many requests from this IP, please try again later.',
});

export default rateLimitMiddleware;