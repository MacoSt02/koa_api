import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';

export const auth = async (ctx: Context, next: Next) => {
    const token = ctx.cookies.get('authToken');
    if (!token) {
        ctx.status = 401;
        ctx.body = {
            success: false,
            message: 'Authentication token is required',
            code: 'UNAUTHORIZED',
        };
        return;
    };

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        ctx.state.user = payload;
        await next();
    } catch (e) {
        ctx.cookies.set('authToken', null, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
        });
        ctx.status = 401;
        ctx.body = {
            success: false,
            message: 'Invalid or expired token: ' + e,
            code: 'UNAUTHORIZED',
        };
    };
};