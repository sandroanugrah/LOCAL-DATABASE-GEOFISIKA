export type Role = 'admin' | 'operator';
export declare class AdminUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    photo: string;
    role: Role;
    user_id: string;
}
export declare class SignInResponse {
    message: string;
    user_id: string;
    access_token: string;
    role: string;
}
export declare class SignUpResponse {
    message: string;
    user: AdminUser;
}
