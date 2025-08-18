"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpResponse = exports.SignInResponse = exports.AdminUser = void 0;
const swagger_1 = require("@nestjs/swagger");
class AdminUser {
    id;
    email;
    first_name;
    last_name;
    photo;
    role;
    user_id;
}
exports.AdminUser = AdminUser;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID Admin atau operator',
        example: 123,
    }),
    __metadata("design:type", Number)
], AdminUser.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email admin atau operator',
        example: 'bhinnekaDev24@gmail.com',
    }),
    __metadata("design:type", String)
], AdminUser.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nama depan admin atau operator',
        example: 'Bhinneka',
    }),
    __metadata("design:type", String)
], AdminUser.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nama belakang admin atau operator',
        example: 'Dev',
    }),
    __metadata("design:type", String)
], AdminUser.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Foto profil admin atau operator',
        example: 'https://contoh.com/bhinnekaDev.jpg',
    }),
    __metadata("design:type", String)
], AdminUser.prototype, "photo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Peran admin atau operator',
        example: 'admin',
    }),
    __metadata("design:type", String)
], AdminUser.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID pengguna di sistem',
        example: 'user-id-123',
    }),
    __metadata("design:type", String)
], AdminUser.prototype, "user_id", void 0);
class SignInResponse {
    message;
    user_id;
    access_token;
    role;
}
exports.SignInResponse = SignInResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pesan yang diberikan setelah login',
        example: 'Login berhasil',
    }),
    __metadata("design:type", String)
], SignInResponse.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID pengguna yang berhasil login',
        example: 'user-id-123',
    }),
    __metadata("design:type", String)
], SignInResponse.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Token akses setelah login',
        example: 'access-token-123',
    }),
    __metadata("design:type", String)
], SignInResponse.prototype, "access_token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Peran admin atau operator',
        example: 'admin',
    }),
    __metadata("design:type", String)
], SignInResponse.prototype, "role", void 0);
class SignUpResponse {
    message;
    user;
}
exports.SignUpResponse = SignUpResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Pesan yang diberikan setelah registrasi',
        example: 'admin berhasil didaftarkan',
    }),
    __metadata("design:type", String)
], SignUpResponse.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data pengguna yang terdaftar',
        type: AdminUser,
    }),
    __metadata("design:type", AdminUser)
], SignUpResponse.prototype, "user", void 0);
//# sourceMappingURL=auth.types.js.map