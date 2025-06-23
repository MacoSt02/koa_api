import { Context } from 'koa';
import * as rolesRepository from './roles.repository';
import { PostRoleBody, PutRoleBody } from './roles.model';

export const getRoles = async (ctx: Context) => {
    try {
        const roles = await rolesRepository.getRoles();
        if (Array.isArray(roles) && roles.length > 0) {
            ctx.status = 200;
            ctx.body = {
                success: true,
                message: 'Roles found',
                data: roles,
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Roles not found',
                code: 'NOT_FOUND',
            };
        }
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error retrieving roles: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const postRole = async (ctx: Context) => {
    try {
        const roleBody = ctx.request.body as PostRoleBody;
        if (!roleBody || typeof roleBody !== 'object' || Object.keys(roleBody).length === 0) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'Request body is required',
                code: 'BAD_REQUEST',
            };
        } else {
            await rolesRepository.postRole(roleBody);
            ctx.status = 201;
            ctx.body = {
                success: true,
                message: 'Role created successfully',
            };
        }
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error creating role: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const putRole = async (ctx: Context) => {
    try {
        const roleBody = ctx.request.body as PutRoleBody;
        const role_id = Number(ctx.params.role_id);
        if (!roleBody || typeof roleBody !== 'object' || Object.keys(roleBody).length === 0) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'Request body is required',
                code: 'BAD_REQUEST',
            };
        } else {
            await rolesRepository.putRole(role_id, ctx.request.body as PutRoleBody);
            ctx.status = 201;
            ctx.body = {
                success: true,
                message: 'Role updated successfully',
            };
        }
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error updating role: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const deleteRole = async (ctx: Context) => {
    try {
        await rolesRepository.deleteRole(Number(ctx.params.role_id));
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'Role deleted successfully',
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: 'Error deleting role: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};