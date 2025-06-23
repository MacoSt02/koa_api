import 'dotenv/config';
import { ApiServer } from './server';
import connectDB from './database/connect';

const server = new ApiServer();

connectDB();
server.listen();
