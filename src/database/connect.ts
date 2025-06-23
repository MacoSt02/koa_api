/* eslint-disable no-console */
import { createPool, Pool } from 'mysql2/promise';

let pool: Pool;

const connectDB = async () => {
    try {
        pool = createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        await pool.getConnection();

        console.info('Succesfull connection to MySQL');
    } catch (error) {
        console.error('Error connecting to MySQL:', error);
    }
};

export const getPool = (): Pool => {
    if (!pool) {
        throw new Error('Pool has not been initialized. Please call connectDB first.');
    }
    return pool;
};

export default connectDB;