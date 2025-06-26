import { ResultSetHeader } from 'mysql2';
import { getPool } from '../../database/connect';
import { CreateUserBody } from './users.model';

export const getUsers = async (search?: string, active?: string) => {
    const pool = getPool();

    const cols = ['u.user_id', 'u.email', 'ur.role_id', 'r.role_name'];
    let params: string[] = [];

    let query = `
        SELECT ${cols.join(', ')}, CASE WHEN u.deleted_at IS NULL THEN 1 ELSE 0 END AS Active, u.created_at, u.updated_at, u.deleted_at
        FROM users u LEFT JOIN user_roles ur ON u.user_id = ur.user_id LEFT JOIN roles r ON ur.role_id = r.role_id
    `;

    let whereConditions: string[] = [];

    if (search) {
        const searchConditions = cols.map(col => `${col.split(' AS ')[0]} LIKE ?`).join(' OR ');
        whereConditions.push(`(${searchConditions})`);
        params = Array(cols.length).fill(`%${search}%`);
    }

    if (active === 'true') {
        whereConditions.push('u.deleted_at IS NULL');
    } else if (active === 'false') {
        whereConditions.push('u.deleted_at IS NOT NULL');
    }

    if (whereConditions.length > 0) {
        query += `WHERE ${whereConditions.join(' AND ')}`;
    }

    const [rows] = await pool.query(query += ';', params);
    return rows;
};

export const createUser = async (user: CreateUserBody) => {
    const pool = getPool();
    const [rows] = await pool.query<ResultSetHeader>('INSERT INTO users (name, email, password) VALUES (?, ?, ?);', [user.name, user.email, user.password]);
    await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?);', [rows.insertId, user.role_id]);
    return rows;
};

export const deleteUser = async (user_id: number) => {
    const pool = getPool();
    const [result] = await pool.query('UPDATE users u SET u.deleted_at = NOW() WHERE u.user_id = ?;', [user_id]);
    return result;
};