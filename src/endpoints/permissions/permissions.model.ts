export type PermissionBody = {
    permission_id: number;
    permission_name: string;
    permission_description: string;
};

export type PostPermissionBody = {
    permission_name: string;
    permission_description: string;
};

export type PutPermissionBody = {
    permission_name?: string;
    permission_description?: string;
};