export type CreateUserBody = {
    name: string;
    email: string;
    password: string;
    role_id: number;
}

export type UpdateUserBody = {
    name: string;
    email: string;
    password: string;
}