import Application from 'koa';
import Router from 'koa-router';
import { getRoles, postRole, putRole, deleteRole } from './roles.controller';
import { auth } from '../../middlewares/auth';
import { permission } from '../../middlewares/permission';

export const rolesRoutes = (app: Application) => {
    const rolesRoutes = new Router();
    rolesRoutes.prefix('/roles');
    // GET
    rolesRoutes.get('/', auth, permission('ViewRoles'), getRoles);
    // POST
    rolesRoutes.post('/', auth, permission('CreateRoles'), postRole);
    // PUT
    rolesRoutes.put('/:role_id', permission('UpdateRoles'), auth, putRole);
    // DELETE
    rolesRoutes.delete('/:role_id', permission('DeleteRoles'), auth, deleteRole);
    app.use(rolesRoutes.routes());
};