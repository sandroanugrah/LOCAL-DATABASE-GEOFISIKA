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
exports.CreateEarthquakeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEarthquakeDto {
    user_id;
    date_time;
    mmi;
    description;
    depth;
    latitude;
    longitude;
    magnitude;
    observer_name;
}
exports.CreateEarthquakeDto = CreateEarthquakeDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEarthquakeDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tanggal dan waktu kejadian gempa (ISO 8601)',
        example: '2025-05-01T14:32:00+07:00',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEarthquakeDto.prototype, "date_time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Intensitas gempa (MMI)', example: 'IV' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEarthquakeDto.prototype, "mmi", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Deskripsi singkat kejadian',
        example: 'Guncangan kuat dirasakan di kota A.',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEarthquakeDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Kedalaman gempa dalam kilometer',
        example: 10.5,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEarthquakeDto.prototype, "depth", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Latitude pusat gempa', example: -6.1751 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEarthquakeDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Longitude pusat gempa', example: 106.865 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEarthquakeDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Magnitudo gempa', example: 5.2 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEarthquakeDto.prototype, "magnitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nama pengamat atau pencatat',
        example: 'Badan Meteorologi A',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEarthquakeDto.prototype, "observer_name", void 0);
//# sourceMappingURL=create-earthquake.dto.js.map