import { getPool } from '../../database/connect';
import { PostPermissionBody, PutPermissionBody } from './permissions.model';

export const getPermissions = async () => {
    const pool = getPool();
    const [rows] = await pool.query('SELECT p.permission_id, p.permission_name, p.permission_description FROM permissions p WHERE p.deleted_at IS NULL;');
    return rows;
};

export const postPermissions = async (permission: PostPermissionBody) => {
    const pool = getPool();
    const [res] = await pool.query('INSERT INTO permissions (permission_name, permission_description) VALUES (?, ?);', [permission.permission_name, permission.permission_description]);
    return res;
};

export const putPermission = async (permission_id: number, permission: PutPermissionBody) => {
    const pool = getPool();

    const restrictedFields = new Set(['created_at', 'updated_at', 'deleted_at']);

    const fieldsToUpdate = Object.entries(permission)
        .filter(([key, value]) => !restrictedFields.has(key) && value !== undefined && value !== null)
        .map(([key]) => `${key} = ?`);

    if (fieldsToUpdate.length === 0) {
        return 'No valid fields to update';
    }

    const setClause = fieldsToUpdate.join(', ');
    const query = `UPDATE permissions SET ${setClause} WHERE permission_id = ?`;

    const values = [...Object.entries(permission)
        .filter(([key, value]) => !restrictedFields.has(key) && value !== undefined && value !== null)
        .map(([, value]) => value), permission_id];

    try {
        const [rows] = await pool.query(query, values);
        return rows;
    } catch (e) {
        throw new Error('Database error while updating user' + e);
    }
};

export const deletePermission = async (permission_id: number) => {
    const pool = getPool();
    const [result] = await pool.query('UPDATE permissions p SET p.deleted_at = NOW() WHERE p.permission_id = ?;', [permission_id]);
    return result;
};