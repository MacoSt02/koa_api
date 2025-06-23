import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { getPool } from '../../database/connect';
import { RolesBody, SignupUsersBody, UsersBody } from './auth.model';

export const getUserByEmail = async (email: string) => {
    const pool = getPool();
    const [rows] = await pool.query<RowDataPacket[]>('SELECT u.user_id, u.name, u.email, u.password, ur.role_id, r.role_name, u.deleted_at FROM users u LEFT JOIN user_roles ur ON u.user_id = ur.user_id LEFT JOIN roles r on ur.role_id = r.role_id WHERE u.email LIKE ?;', [email]);
    return rows.length > 0 ? (rows[0] as UsersBody) : null;
};

export const getUserPermissions = async (user_id: number) => {
    const pool = getPool();
    const query = `
        SELECT CONCAT(
            UPPER(LEFT(SUBSTRING_INDEX(SUBSTRING_INDEX(p.permission_name, ':', -2), ':', -1), 1)),
            LOWER(SUBSTRING(SUBSTRING_INDEX(SUBSTRING_INDEX(p.permission_name, ':', -2), ':', -1), 2)),
            UPPER(LEFT(SUBSTRING_INDEX(SUBSTRING_INDEX(p.permission_name, ':', -2), ':', 1), 1)),
            LOWER(SUBSTRING(SUBSTRING_INDEX(SUBSTRING_INDEX(p.permission_name, ':', -2), ':', 1), 2))
        ) AS permission_name
        FROM permissions p
        JOIN role_permissions rp ON p.permission_id = rp.permission_id
        JOIN roles r ON rp.role_id = r.role_id
        JOIN user_roles ur ON r.role_id = ur.role_id
        WHERE ur.user_id = ?;
    `;
    const [rows] = await pool.query(query, [user_id]);
    return rows;
};

export const signupUser = async (user: SignupUsersBody) => {
    const pool = getPool();
    const [rows] = await pool.query<ResultSetHeader>('INSERT INTO users (name, email, password) VALUES (?, ?, ?);', [user.name, user.email, user.password]);
    const [roleRows] = await pool.query<RolesBody[]>('SELECT role_id FROM roles WHERE role_name LIKE ?;',['user']);
    await pool.query('INSERT INTO user_roles (user_id, role_id) VALUES (?, ?);', [rows.insertId, roleRows[0].role_id]);
    return rows;
};