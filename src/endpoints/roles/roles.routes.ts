import Application from 'koa';
import Router from 'koa-router';
import { getRoles, postRole, putRole, deleteRole } from './roles.controller';
import { auth } from '../../middlewares/auth';

export const rolesRoutes = (app: Application) => {
    const rolesRoutes = new Router();
    rolesRoutes.prefix('/roles');
    // GET
    rolesRoutes.get('/', auth, getRoles);
    // POST
    rolesRoutes.post('/', auth, postRole);
    // PUT
    rolesRoutes.put('/:role_id', auth, putRole);
    // DELETE
    rolesRoutes.delete('/:role_id', auth, deleteRole);
    app.use(rolesRoutes.routes());
};