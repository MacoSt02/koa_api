import Application from 'koa';
import Router from 'koa-router';
import { getUsers, deleteUser } from './users.controller';
import { auth } from '../../middlewares/auth';

export const usersRoutes = (app: Application) => {
    const usersRoutes = new Router();
    usersRoutes.prefix('/users');
    // GET
    usersRoutes.get('/', auth, getUsers);
    // POST

    // PUT

    // DELETE
    usersRoutes.delete('/:user_id', auth, deleteUser);
    app.use(usersRoutes.routes());
};