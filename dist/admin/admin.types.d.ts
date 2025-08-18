export declare enum Role {
    ADMIN = "admin",
    OPERATOR = "operator"
}
export declare class AdminUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    photo?: string;
    role: Role;
    user_id: string;
}
export declare class EditResponse {
    user: AdminUser;
    status: string;
}
export declare class DeleteResponse {
    user: AdminUser;
    status: string;
}
