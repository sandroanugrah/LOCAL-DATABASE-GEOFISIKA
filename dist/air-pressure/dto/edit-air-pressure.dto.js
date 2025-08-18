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
exports.EditAirPressureDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class EditAirPressureDto {
    id;
    user_id;
    air_pressure;
    air_pressure_07;
    air_pressure_13;
    air_pressure_18;
    date;
}
exports.EditAirPressureDto = EditAirPressureDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EditAirPressureDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditAirPressureDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tekanan udara', example: 1013 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EditAirPressureDto.prototype, "air_pressure", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tekanan udara pada pukul 07:00',
        example: 1012.1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EditAirPressureDto.prototype, "air_pressure_07", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tekanan udara pada pukul 13:00',
        example: 1012.8,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EditAirPressureDto.prototype, "air_pressure_13", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tekanan udara pada pukul 18:00',
        example: 1012.5,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EditAirPressureDto.prototype, "air_pressure_18", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tanggal',
        example: '2025-01-01',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditAirPressureDto.prototype, "date", void 0);
//# sourceMappingURL=edit-air-pressure.dto.js.map