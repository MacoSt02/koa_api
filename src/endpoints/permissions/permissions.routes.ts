import Application from 'koa';
import Router from 'koa-router';
import { getPermissions, postPermissions, putPermission, deletePermission } from './permissions.controller';
import { auth } from '../../middlewares/auth';
import { permission } from '../../middlewares/permission';

export const permissionsRoutes = (app: Application) => {
    const permissionsRoutes = new Router();
    permissionsRoutes.prefix('/permissions');
    // GET
    permissionsRoutes.get('/', auth, permission('ViewPermissions'), getPermissions);
    // POST
    permissionsRoutes.post('/', auth, permission('CreatePermissions'), postPermissions);
    // PUT
    permissionsRoutes.put('/:permission_id', auth, permission('UpdatePermissions'), putPermission);
    // DELETE
    permissionsRoutes.delete('/:permission_id', auth, permission('DeletePermissions'), deletePermission);
    app.use(permissionsRoutes.routes());
};