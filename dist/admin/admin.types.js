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
exports.DeleteResponse = exports.EditResponse = exports.AdminUser = exports.Role = void 0;
const swagger_1 = require("@nestjs/swagger");
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["OPERATOR"] = "operator";
})(Role || (exports.Role = Role = {}));
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
        enum: Role,
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
class EditResponse {
    user;
    status;
}
exports.EditResponse = EditResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data pengguna yang diubah',
        type: AdminUser,
    }),
    __metadata("design:type", AdminUser)
], EditResponse.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status pengubahan',
        example: 'success',
    }),
    __metadata("design:type", String)
], EditResponse.prototype, "status", void 0);
class DeleteResponse {
    user;
    status;
}
exports.DeleteResponse = DeleteResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Data pengguna yang dihapus',
        type: AdminUser,
    }),
    __metadata("design:type", AdminUser)
], DeleteResponse.prototype, "user", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status penghapusan',
        example: 'success',
    }),
    __metadata("design:type", String)
], DeleteResponse.prototype, "status", void 0);
//# sourceMappingURL=admin.types.js.map