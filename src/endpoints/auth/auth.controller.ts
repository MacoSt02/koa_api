import { Context } from 'koa';
import bcrypt from 'bcryptjs';
import * as authRepository from './auth.repository';
import { SignupUsersBody, UsersBody } from './auth.model';
import jwt from 'jsonwebtoken';

export const getAuth = async (ctx: Context) => {
    try {
        const token = ctx.cookies.get('authToken');
        if (!token) {
            ctx.status = 401;
            ctx.body = {
                success: false,
                message: 'Not authenticated',
                code: 'BAD_REQUEST',
            };
            return;
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        const permissions = await authRepository.getUserPermissions(payload.user_id);
        ctx.status = 200;
        ctx.body = {
            success: true,
            data: permissions,
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const signupUser = async (ctx: Context) => {
    try {
        const user = ctx.request.body as SignupUsersBody;

        const userExists = await authRepository.getUserByEmail(user.email);
        if (userExists !== null) {
            if (userExists.deleted_at !== null) {
                await authRepository.reactivateUser(userExists.email);
                ctx.status = 200;
                ctx.body = {
                    success: true,
                    message: 'User account has been reactivated',
                    code: 'USER_REACTIVATED',
                };
                return;
            }
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'User already exists, please login',
                code: 'USER_ALREADY_EXISTS',
            };
            return;
        }

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);

        await authRepository.signupUser(user);
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'User signed up successfully',
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error retrieving user: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const loginUser = async (ctx: Context) => {
    try {
        const { email, password } = ctx.request.body as SignupUsersBody;
        if (!email || !password) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                error: 'Email and password are required',
                code: 'MISSING_CREDENTIALS',
            };
            return;
        }

        const user = await authRepository.getUserByEmail(email) as unknown as UsersBody | undefined;
        if (!user) {
            ctx.status = 401;
            ctx.body = {
                success: false,
                error: 'Invalid email or password',
                code: 'INVALID_CREDENTIALS',
            };
            return;
        }

        if (user.deleted_at !== null) {
            ctx.status = 401;
            ctx.body = {
                success: false,
                error: 'This account has been deactivated',
                code: 'ACCOUNT_DEACTIVATED',
            };
            return;
        }

        if (!user.role_id) {
            ctx.status = 401;
            ctx.body = {
                success: false,
                error: 'User does not have a role',
                code: 'USER_NO_ROLE',
            };
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            ctx.status = 401;
            ctx.body = {
                success: false,
                error: 'Invalid email or password',
                code: 'INVALID_CREDENTIALS',
            };
            return;
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                email: user.email,
                role_id: user.role_id,
                role_name: user.role_name,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' },
            // { expiresIn: '1m' }, // For testing
        );

        ctx.cookies.set('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 3600 * 1000,
            // maxAge: 60 * 1000, // For testing
        });

        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'Log In OK',
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Invalid email or password: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const logoutUser = async (ctx: Context) => {
    try {
        ctx.cookies.set('authToken', null, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0,
        });

        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'Log Out succesfuly',
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Invalid email or password: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};