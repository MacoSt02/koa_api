import { getPool } from '../../database/connect';
import { PostRoleBody, PutRoleBody } from './roles.model';

export const getRoles = async () => {
    const pool = getPool();
    const [rows] = await pool.query('SELECT r.role_id, r.role_name, r.role_description FROM roles r WHERE r.deleted_at IS NULL;');
    return rows;
};

export const postRole = async (role: PostRoleBody) => {
    const pool = getPool();
    const [res] = await pool.query('INSERT INTO roles (role_name, role_description) VALUES (?, ?);', [role.role_name, role.role_description]);
    return res;
};

export const putRole = async (role_id: number, role: PutRoleBody) => {
    const pool = getPool();

    const restrictedFields = new Set(['created_at', 'updated_at', 'deleted_at']);

    const fieldsToUpdate = Object.entries(role)
        .filter(([key, value]) => !restrictedFields.has(key) && value !== undefined && value !== null)
        .map(([key]) => `${key} = ?`);

    if (fieldsToUpdate.length === 0) {
        return 'No valid fields to update';
    }

    const setClause = fieldsToUpdate.join(', ');
    const query = `UPDATE roles SET ${setClause} WHERE role_id = ?`;

    const values = [...Object.entries(role)
        .filter(([key, value]) => !restrictedFields.has(key) && value !== undefined && value !== null)
        .map(([, value]) => value), role_id];

    try {
        const [rows] = await pool.query(query, values);
        return rows;
    } catch (e) {
        throw new Error('Database error while updating user' + e);
    }
};

export const deleteRole = async (role_id: number) => {
    const pool = getPool();
    const [result] = await pool.query('UPDATE roles r SET r.deleted_at = NOW() WHERE r.role_id = ?;', [role_id]);
    return result;
};