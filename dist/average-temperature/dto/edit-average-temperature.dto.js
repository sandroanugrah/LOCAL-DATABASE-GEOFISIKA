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
exports.EditAverageTemperatureDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class EditAverageTemperatureDto {
    id;
    user_id;
    avg_temperature_07;
    avg_temperature_13;
    avg_temperature_18;
    date;
}
exports.EditAverageTemperatureDto = EditAverageTemperatureDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EditAverageTemperatureDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditAverageTemperatureDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Temperatur rata rata pada pukul 07:00',
        example: 1012.1,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EditAverageTemperatureDto.prototype, "avg_temperature_07", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Temperatur rata rata pada pukul 13:00',
        example: 1012.8,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EditAverageTemperatureDto.prototype, "avg_temperature_13", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Temperatur rata rata pada pukul 18:00',
        example: 1012.5,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], EditAverageTemperatureDto.prototype, "avg_temperature_18", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tanggal',
        example: '2025-01-01',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EditAverageTemperatureDto.prototype, "date", void 0);
//# sourceMappingURL=edit-average-temperature.dto.js.map