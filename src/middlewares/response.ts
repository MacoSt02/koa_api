import { Context, Next } from 'koa';

export const responseHandler = async (ctx: Context, next: Next) => {
    try {
        await next();
    } catch (error: any) {
        ctx.status = error.status || 500;
        ctx.body = {
            success: false,
            error: error.message || 'Internal Server Error',
        };
    }
};
