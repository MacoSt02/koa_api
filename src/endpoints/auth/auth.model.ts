import { RowDataPacket } from 'mysql2';

export type SignupUsersBody = {
    name: string,
    email: string;
    password: string;
};

export type UsersBody = {
    user_id: number;
    email: string;
    password: string;
    role_id: number;
    role_name: string;
    deleted_at: string;
};

export type RolesBody = {
    role_id: number;
} & RowDataPacket;