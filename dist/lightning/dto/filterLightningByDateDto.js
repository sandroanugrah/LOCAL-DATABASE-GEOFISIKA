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
exports.FilterLightningByDateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class FilterLightningByDateDto {
    lightning_data;
    start_date;
    end_date;
}
exports.FilterLightningByDateDto = FilterLightningByDateDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Sebagai Contoh (IKL, KML, LDC, Summaries, CSV, SRF)',
        description: 'Nama Data Petir',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterLightningByDateDto.prototype, "lightning_data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nilai tanggal pada awal petir',
        example: '2023-01-01',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterLightningByDateDto.prototype, "start_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nilai tanggal pada akhir petir',
        example: '2023-10-10',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FilterLightningByDateDto.prototype, "end_date", void 0);
//# sourceMappingURL=filterLightningByDateDto.js.map