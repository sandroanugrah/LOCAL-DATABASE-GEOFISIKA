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
exports.MinTemperatureController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const min_temperature_service_1 = require("./min-temperature.service");
const minTemperatureQueryDto_1 = require("./dto/minTemperatureQueryDto");
const edit_min_temperature_dto_1 = require("./dto/edit-min-temperature.dto");
const create_min_temperature_dto_1 = require("./dto/create-min-temperature.dto");
const getMinTemperatureQueryDto_1 = require("./dto/getMinTemperatureQueryDto");
const filterMinTemperatureByDateDto_1 = require("./dto/filterMinTemperatureByDateDto");
const create_min_temperature_excel_dto_1 = require("./dto/create-min-temperature-excel.dto");
let MinTemperatureController = class MinTemperatureController {
    minTemperatureService;
    constructor(minTemperatureService) {
        this.minTemperatureService = minTemperatureService;
    }
    async saveMinTemperature(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.minTemperatureService.saveMinTemperature(dto, ipAddress, userAgent);
        return result;
    }
    async saveMinTemperatureExcel(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.minTemperatureService.saveExcelMinTemperature(dto, ipAddress, userAgent);
        return result;
    }
    async updateMinTemperature(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        const result = await this.minTemperatureService.updateMinTemperature(dto, ipAddress, userAgent);
        return result;
    }
    async deleteMinTemperature(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.minTemperatureService.deleteMinTemperature(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getAllMinTemperature() {
        const result = await this.minTemperatureService.getAllMinTemperature();
        return result;
    }
    async getMinTemperatureById(querys) {
        const result = await this.minTemperatureService.getMinTemperatureById(querys.id);
        return result;
    }
    async getMinTemperatureByDate(query) {
        return await this.minTemperatureService.getMinTemperatureByDate(query);
    }
};
exports.MinTemperatureController = MinTemperatureController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_min_temperature_dto_1.CreateMinTemperatureDto]),
    __metadata("design:returntype", Promise)
], MinTemperatureController.prototype, "saveMinTemperature", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_min_temperature_excel_dto_1.CreateMinTemperatureExcelDto]),
    __metadata("design:returntype", Promise)
], MinTemperatureController.prototype, "saveMinTemperatureExcel", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_min_temperature_dto_1.EditMinTemperatureDto,
        minTemperatureQueryDto_1.MinTemperatureQueryDto]),
    __metadata("design:returntype", Promise)
], MinTemperatureController.prototype, "updateMinTemperature", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil menghapus data temperatur minimal' }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, minTemperatureQueryDto_1.MinTemperatureQueryDto]),
    __metadata("design:returntype", Promise)
], MinTemperatureController.prototype, "deleteMinTemperature", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan semua data temperatur minimal',
    }),
    (0, common_1.Get)('/get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MinTemperatureController.prototype, "getAllMinTemperature", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data temperatur minimal berdasarkan id',
    }),
    (0, common_1.Get)('/get'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getMinTemperatureQueryDto_1.GetMinTemperatureQueryDto]),
    __metadata("design:returntype", Promise)
], MinTemperatureController.prototype, "getMinTemperatureById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data temperatur minimal berdasarkan rentang tanggal',
    }),
    (0, common_1.Get)('/get-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterMinTemperatureByDateDto_1.FilterMinTemperatureByDateDto]),
    __metadata("design:returntype", Promise)
], MinTemperatureController.prototype, "getMinTemperatureByDate", null);
exports.MinTemperatureController = MinTemperatureController = __decorate([
    (0, swagger_1.ApiTags)('Min Temperatue'),
    (0, common_1.Controller)('min-temperature'),
    __metadata("design:paramtypes", [min_temperature_service_1.MinTemperatureService])
], MinTemperatureController);
//# sourceMappingURL=min-temperature.controller.js.map