import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import * as authRepository from '../endpoints/auth/auth.repository';

export function permission(permission: string) {
    return async (ctx: Context, next: Next) => {
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

        const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        const permissions = await authRepository.getUserPermissions(payload.user_id);

        if (!permissions.includes(permission)) {
            ctx.status = 403;
            ctx.body = {
                success: false,
                message: `Missing required permission: ${permission}`,
                code: 'FORBIDDEN',
            };
            return;
        }

        await next();
    };
};