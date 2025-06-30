import { Context } from 'koa';
import bcrypt from 'bcryptjs';
import * as usersRepository from './users.repository';
import * as authRepository from '../auth/auth.repository';
import { CreateUserBody, UpdateUserBody } from './users.model';

export const getUsers = async (ctx: Context) => {
    try {
        const search = ctx.query.search as string;
        const active = ctx.query.active as string;
        const users = await usersRepository.getUsers(search, active);
        if (Array.isArray(users) && users.length > 0) {
            ctx.status = 200;
            ctx.body = {
                success: true,
                message: 'Users found',
                data: users,
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Users not found',
                code: 'NOT_FOUND',
            };
        }
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error retrieving users: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const createUser = async (ctx: Context) => {
    try {
        const user = ctx.request.body as CreateUserBody;
        const userExists = await authRepository.getUserByEmail(user.email);
        if (userExists !== null) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'User already exists',
                code: 'USER_ALREADY_EXISTS',
            };
            return;
        }

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);

        await usersRepository.createUser(user);
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'User created successfully',
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: 'Error creating user: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const updateUser = async (ctx: Context) => {
    try {
        const user = ctx.request.body as UpdateUserBody;
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
        await usersRepository.updateUser(Number(ctx.params.user_id), user);
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'User updated successfully',
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: 'Error updating user: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const deleteUser = async (ctx: Context) => {
    try {
        await usersRepository.deleteUser(Number(ctx.params.user_id));
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'User deleted successfully',
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: 'Error deleting user: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};