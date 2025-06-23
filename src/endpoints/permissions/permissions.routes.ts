import Application from 'koa';
import Router from 'koa-router';
import { getPermissions, postPermissions, putPermission, deletePermission } from './permissions.controller';
import { auth } from '../../middlewares/auth';

export const permissionsRoutes = (app: Application) => {
    const permissionsRoutes = new Router();
    permissionsRoutes.prefix('/permissions');
    // GET
    permissionsRoutes.get('/', auth, getPermissions);
    // POST
    permissionsRoutes.post('/', auth, postPermissions);
    // PUT
    permissionsRoutes.put('/:permission_id', auth, putPermission);
    // DELETE
    permissionsRoutes.delete('/:permission_id', auth, deletePermission);
    app.use(permissionsRoutes.routes());
};