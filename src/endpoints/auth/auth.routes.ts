import Application from 'koa';
import Router from 'koa-router';
import { signupUser, loginUser, logoutUser, getAuth } from './auth.controller';

export const authRoutes = (app: Application) => {
    const authRoutes = new Router();
    authRoutes.prefix('/');
    // GET
    authRoutes.get('/auth', getAuth);

    // POST
    authRoutes.post('/signup', signupUser);
    authRoutes.post('/login', loginUser);
    authRoutes.post('/logout', logoutUser);
    // PUT

    // DELETE

    app.use(authRoutes.routes());
};