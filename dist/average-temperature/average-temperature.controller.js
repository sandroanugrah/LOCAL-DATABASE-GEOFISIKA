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
exports.AverageTemperatureController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const average_temperature_service_1 = require("./average-temperature.service");
const averageTemperatureQueryDto_1 = require("./dto/averageTemperatureQueryDto");
const edit_average_temperature_dto_1 = require("./dto/edit-average-temperature.dto");
const create_average_temperature_dto_1 = require("./dto/create-average-temperature.dto");
const getAverageTemperatureQueryDto_1 = require("./dto/getAverageTemperatureQueryDto");
const filterAverageTemperatureByDateDto_1 = require("./dto/filterAverageTemperatureByDateDto");
const create_average_temperature_excel_dto_1 = require("./dto/create-average-temperature-excel.dto");
let AverageTemperatureController = class AverageTemperatureController {
    averageTemperatureService;
    constructor(averageTemperatureService) {
        this.averageTemperatureService = averageTemperatureService;
    }
    async saveAverageTemperature(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.averageTemperatureService.saveAverageTemperature(dto, ipAddress, userAgent);
        return result;
    }
    async saveaAverageTemperaturePressureExcel(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.averageTemperatureService.saveExcelAverageTemperature(dto, ipAddress, userAgent);
        return result;
    }
    async updateAverageTemperature(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        const result = await this.averageTemperatureService.updateAverageTemperature(dto, ipAddress, userAgent);
        return result;
    }
    async deleteAverageTemperature(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.averageTemperatureService.deleteAverageTemperature(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getAllAverageTemperature() {
        const result = await this.averageTemperatureService.getAllAverageTemperature();
        return result;
    }
    async getAverageTemperatureById(querys) {
        const result = await this.averageTemperatureService.getAverageTemperatureById(querys.id);
        return result;
    }
    async getAverageTemperatureByDate(query) {
        return await this.averageTemperatureService.getAverageTemperatureByDate(query);
    }
};
exports.AverageTemperatureController = AverageTemperatureController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_average_temperature_dto_1.CreateAverageTemperatureDto]),
    __metadata("design:returntype", Promise)
], AverageTemperatureController.prototype, "saveAverageTemperature", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_average_temperature_excel_dto_1.CreateAverageTemperatureExcelDto]),
    __metadata("design:returntype", Promise)
], AverageTemperatureController.prototype, "saveaAverageTemperaturePressureExcel", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_average_temperature_dto_1.EditAverageTemperatureDto,
        averageTemperatureQueryDto_1.AverageTemperatureQueryDto]),
    __metadata("design:returntype", Promise)
], AverageTemperatureController.prototype, "updateAverageTemperature", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil menghapus data temperatur rata rata',
    }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, averageTemperatureQueryDto_1.AverageTemperatureQueryDto]),
    __metadata("design:returntype", Promise)
], AverageTemperatureController.prototype, "deleteAverageTemperature", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan semua data temperatur rata rata',
    }),
    (0, common_1.Get)('/get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AverageTemperatureController.prototype, "getAllAverageTemperature", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data temperatur rata rata berdasarkan id',
    }),
    (0, common_1.Get)('/get'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getAverageTemperatureQueryDto_1.GetAverageTemperatureQueryDto]),
    __metadata("design:returntype", Promise)
], AverageTemperatureController.prototype, "getAverageTemperatureById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data temperatur rata rata berdasarkan rentang tanggal temperatur rata rata',
    }),
    (0, common_1.Get)('/get-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterAverageTemperatureByDateDto_1.FilterAverageTemperatureByDateDto]),
    __metadata("design:returntype", Promise)
], AverageTemperatureController.prototype, "getAverageTemperatureByDate", null);
exports.AverageTemperatureController = AverageTemperatureController = __decorate([
    (0, swagger_1.ApiTags)('Average Temperature'),
    (0, common_1.Controller)('average-temperature'),
    __metadata("design:paramtypes", [average_temperature_service_1.AverageTemperatureService])
], AverageTemperatureController);
//# sourceMappingURL=average-temperature.controller.js.map