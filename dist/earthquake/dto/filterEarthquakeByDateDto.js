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
exports.FilterEarthquakeByDateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const validatorMMI_1 = require("./validatorMMI");
class FilterEarthquakeByDateDto {
    start_date;
    end_date;
    min_magnitude;
    max_magnitude;
    min_depth;
    max_depth;
    min_lat;
    max_lat;
    min_long;
    max_long;
    min_mmi;
    max_mmi;
}
exports.FilterEarthquakeByDateDto = FilterEarthquakeByDateDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: 'Nilai tanggal pada awal gempa',
        example: '2023-10-01',
        required: false,
    }),
    __metadata("design:type", String)
], FilterEarthquakeByDateDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, swagger_1.ApiProperty)({
        description: 'Nilai tanggal pada akhir gempa',
        example: '2023-10-10',
        required: false,
    }),
    __metadata("design:type", String)
], FilterEarthquakeByDateDto.prototype, "end_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    (0, swagger_1.ApiProperty)({
        description: 'Nilai minimum magnitude',
        example: '4.5',
        required: false,
    }),
    __metadata("design:type", String)
], FilterEarthquakeByDateDto.prototype, "min_magnitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    (0, swagger_1.ApiProperty)({
        description: 'Nilai maksimum magnitude',
        example: '6.0',
        required: false,
    }),
    __metadata("design:type", String)
], FilterEarthquakeByDateDto.prototype, "max_magnitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    (0, swagger_1.ApiProperty)({
        description: 'Nilai minimum kedalaman gempa (depth)',
        example: '10',
        required: false,
    }),
    __metadata("design:type", String)
], FilterEarthquakeByDateDto.prototype, "min_depth", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    (0, swagger_1.ApiProperty)({
        description: 'Nilai maksimum kedalaman gempa (depth)',
        example: '100',
        required: false,
    }),
    __metadata("design:type", String)
], FilterEarthquakeByDateDto.prototype, "max_depth", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    (0, swagger_1.ApiProperty)({
        description: 'Nilai minimum latitude gempa',
        example: '0.0',
        required: false,
    }),
    __metadata("design:type", String)
], FilterEarthquakeByDateDto.prototype, "min_lat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    (0, swagger_1.ApiProperty)({
        description: 'Nilai maksimum latitude gempa',
        example: '0.0',
        required: false,
    }),
    __metadata("design:type", String)
], FilterEarthquakeByDateDto.prototype, "max_lat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    (0, swagger_1.ApiProperty)({
        description: 'Nilai minimum longitude gempa',
        example: '0.0',
        required: false,
    }),
    __metadata("design:type", String)
], FilterEarthquakeByDateDto.prototype, "min_long", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    (0, swagger_1.ApiProperty)({
        description: 'Nilai maksimum longitude gempa',
        example: '0.0',
        required: false,
    }),
    __metadata("design:type", String)
], FilterEarthquakeByDateDto.prototype, "max_long", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, validatorMMI_1.IsMMI)({ message: 'min_mmi must be number (1–12) or Roman numeral (I–XII)' }),
    (0, swagger_1.ApiProperty)({
        description: 'Nilai minimum mmi gempa (angka atau Romawi)',
        example: 'I',
        required: false,
    }),
    __metadata("design:type", String)
], FilterEarthquakeByDateDto.prototype, "min_mmi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, validatorMMI_1.IsMMI)({ message: 'max_mmi must be number (1–12) or Roman numeral (I–XII)' }),
    (0, swagger_1.ApiProperty)({
        description: 'Nilai maksimum mmi gempa (angka atau Romawi)',
        example: 'XII',
        required: false,
    }),
    __metadata("design:type", String)
], FilterEarthquakeByDateDto.prototype, "max_mmi", void 0);
//# sourceMappingURL=filterEarthquakeByDateDto.js.map