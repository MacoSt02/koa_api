import { Context } from 'koa';
import * as permissionsRepository from './permissions.repository';
import { PostPermissionBody, PutPermissionBody } from './permissions.model';

export const getPermissions = async (ctx: Context) => {
    try {
        const permissions = await permissionsRepository.getPermissions();
        if (Array.isArray(permissions) && permissions.length > 0) {
            ctx.status = 200;
            ctx.body = {
                success: true,
                message: 'Permissions found',
                data: permissions,
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'Permissions not found',
                code: 'NOT_FOUND',
            };
        }
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error retrieving permissions: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const postPermissions = async (ctx: Context) => {
    try {
        const body = ctx.request.body as PostPermissionBody;
        if (!body || typeof body !== 'object' || Object.keys(body).length === 0) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'Request body is required',
                code: 'BAD_REQUEST',
            };
        } else {
            await permissionsRepository.postPermissions(body);
            ctx.status = 201;
            ctx.body = {
                success: true,
                message: 'Permission created successfully',
            };
        }
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error creating permission: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const putPermission = async (ctx: Context) => {
    try {
        const permissionBody = ctx.request.body as PutPermissionBody;
        const permission_id = Number(ctx.params.permission_id);
        if (!permissionBody || typeof permissionBody !== 'object' || Object.keys(permissionBody).length === 0) {
            ctx.status = 400;
            ctx.body = {
                success: false,
                message: 'Request body is required',
                code: 'BAD_REQUEST',
            };
        } else {
            await permissionsRepository.putPermission(permission_id, ctx.request.body as PutPermissionBody);
            ctx.status = 201;
            ctx.body = {
                success: true,
                message: 'Permission updated successfully',
            };
        }
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            message: 'Error updating permission: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};

export const deletePermission = async (ctx: Context) => {
    try {
        await permissionsRepository.deletePermission(Number(ctx.params.permission_id));
        ctx.status = 200;
        ctx.body = {
            success: true,
            message: 'Permission deleted successfully',
        };
    } catch (e) {
        ctx.status = 500;
        ctx.body = {
            success: false,
            error: 'Error deleting permission: ' + e,
            code: 'INTERNAL_SERVER_ERROR',
        };
    }
};