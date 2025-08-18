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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxTemperatureController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const max_temperature_service_1 = require("./max-temperature.service");
const maxTemperatureQueryDto_1 = require("./dto/maxTemperatureQueryDto");
const edit_max_temperature_dto_1 = require("./dto/edit-max-temperature.dto");
const create_max_temperature_dto_1 = require("./dto/create-max-temperature.dto");
const getMaxTemperatureQueryDto_1 = require("./dto/getMaxTemperatureQueryDto");
const filterMaxTemperatureByDateDto_1 = require("./dto/filterMaxTemperatureByDateDto");
const create_max_temperature_excel_dto_1 = require("./dto/create-max-temperature-excel.dto");
let MaxTemperatureController = class MaxTemperatureController {
    maxTemperatureService;
    constructor(maxTemperatureService) {
        this.maxTemperatureService = maxTemperatureService;
    }
    async saveMaxTemperature(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.maxTemperatureService.saveMaxTemperature(dto, ipAddress, userAgent);
        return result;
    }
    async saveMaxTemperatureExcel(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.maxTemperatureService.saveExcelMaxTemperature(dto, ipAddress, userAgent);
        return result;
    }
    async updateMaxTemperature(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        const result = await this.maxTemperatureService.updateMaxTemperature(dto, ipAddress, userAgent);
        return result;
    }
    async deleteMaxTemperature(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        const result = await this.maxTemperatureService.deleteMaxTemperature(querys.id, querys.user_id, ipAddress, userAgent);
        return result;
    }
    async getAllMaxTemperature() {
        const result = await this.maxTemperatureService.getAllMaxTemperature();
        return result;
    }
    async getMaxTemperatureById(querys) {
        const result = await this.maxTemperatureService.getMaxTemperatureById(querys.id);
        return result;
    }
    async getMaxTemperatureByDate(query) {
        return await this.maxTemperatureService.getMaxTemperatureByDate(query);
    }
};
exports.MaxTemperatureController = MaxTemperatureController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_max_temperature_dto_1.CreateMaxTemperatureDto]),
    __metadata("design:returntype", Promise)
], MaxTemperatureController.prototype, "saveMaxTemperature", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_max_temperature_excel_dto_1.CreateMaxTemperatureExcelDto]),
    __metadata("design:returntype", Promise)
], MaxTemperatureController.prototype, "saveMaxTemperatureExcel", null);
__decorate([
    (0, common_1.Put)(`/update`),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_max_temperature_dto_1.EditMaxTemperatureDto,
        maxTemperatureQueryDto_1.MaxTemperatureQueryDto]),
    __metadata("design:returntype", Promise)
], MaxTemperatureController.prototype, "updateMaxTemperature", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil menghapus data temperatur maksimal' }),
    (0, common_1.Delete)(`/delete`),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, maxTemperatureQueryDto_1.MaxTemperatureQueryDto]),
    __metadata("design:returntype", Promise)
], MaxTemperatureController.prototype, "deleteMaxTemperature", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan semua data temperatur maksimal',
    }),
    (0, common_1.Get)('/get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MaxTemperatureController.prototype, "getAllMaxTemperature", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data temperatur maksimal berdasarkan id',
    }),
    (0, common_1.Get)('/get'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getMaxTemperatureQueryDto_1.GetMaxTemperatureQueryDto]),
    __metadata("design:returntype", Promise)
], MaxTemperatureController.prototype, "getMaxTemperatureById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data temperatur maksimal berdasarkan rentang tanggal',
    }),
    (0, common_1.Get)('/get-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterMaxTemperatureByDateDto_1.FilterMaxTemperatureByDateDto]),
    __metadata("design:returntype", Promise)
], MaxTemperatureController.prototype, "getMaxTemperatureByDate", null);
exports.MaxTemperatureController = MaxTemperatureController = __decorate([
    (0, swagger_1.ApiTags)('Max Temperature'),
    (0, common_1.Controller)('max-temperature'),
    __metadata("design:paramtypes", [max_temperature_service_1.MaxTemperatureService])
], MaxTemperatureController);
//# sourceMappingURL=max-temperature.controller.js.map