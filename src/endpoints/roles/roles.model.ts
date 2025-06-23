export type RoleBody = {
    role_id: number;
    role_name: string;
    role_description: string;
};

export type PostRoleBody = {
    role_name: string;
    role_description: string;
};

export type PutRoleBody = {
    role_name?: string;
    role_description?: string;
};