export declare enum Role {
    ADMIN = "admin",
    OPERATOR = "operator"
}
export declare class UpdateAdminDto {
    user_id: string;
    id_role: string;
    first_name: string;
    last_name: string;
    email: string;
    role: Role;
    file_base64: string;
    password?: string;
}
