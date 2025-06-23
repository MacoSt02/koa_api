import Application from 'koa';
import Router from 'koa-router';
import { getUsers, deleteUser } from './users.controller';
import { auth } from '../../middlewares/auth';
import { permission } from '../../middlewares/permission';

export const usersRoutes = (app: Application) => {
    const usersRoutes = new Router();
    usersRoutes.prefix('/users');
    // GET
    usersRoutes.get('/', auth, permission('ViewUsers'), getUsers);
    // POST

    // PUT

    // DELETE
    usersRoutes.delete('/:user_id', auth, deleteUser);
    app.use(usersRoutes.routes());
};