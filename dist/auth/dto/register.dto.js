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
exports.RegisterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RegisterDto {
    email;
    password;
    first_name;
    last_name;
    file_base64;
    role;
}
exports.RegisterDto = RegisterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email admin atau operator untuk registrasi',
        example: 'bhinnekaDev24@gmail.com',
    }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email yang dimasukkan tidak valid.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email tidak boleh kosong.' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Password admin atau operator untuk registrasi',
        example: 'bhinnekaDev24.',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password tidak boleh kosong.' }),
    (0, class_validator_1.MinLength)(8, { message: 'Password harus memiliki minimal 8 karakter.' }),
    (0, class_validator_1.Matches)(/^(?=.*[0-9])(?=.*[!@#$%^&*.])[A-Za-z0-9!@#$%^&*.]{8,}$/, {
        message: 'Password harus mengandung minimal 8 karakter, dengan angka dan simbol seperti !@#$%^&*.',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nama depan admin atau operator',
        example: 'Bhinneka',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nama depan tidak boleh kosong.' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "first_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nama belakang admin atau operator',
        example: 'Developer',
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nama belakang tidak boleh kosong.' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "last_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'data:image/jpeg;base64,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',
        description: 'File tanda waktu dalam base64',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)({ message: 'Foto profil harus berupa string.' }),
    __metadata("design:type", String)
], RegisterDto.prototype, "file_base64", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Peran admin atau operator',
        enum: ['admin', 'operator'],
        example: 'admin',
    }),
    (0, class_validator_1.IsEnum)(['admin', 'operator'], {
        message: 'Peran harus salah satu dari admin atau operator.',
    }),
    __metadata("design:type", String)
], RegisterDto.prototype, "role", void 0);
//# sourceMappingURL=register.dto.js.map