import Application from 'koa';
import Router from 'koa-router';
import { signupUser, loginUser, logoutUser } from './auth.controller';

export const authRoutes = (app: Application) => {
    const authRoutes = new Router();
    authRoutes.prefix('/');
    // GET

    // POST
    authRoutes.post('/signup', signupUser);
    authRoutes.post('/login', loginUser);
    authRoutes.post('/logout', logoutUser);
    // PUT

    // DELETE

    app.use(authRoutes.routes());
};