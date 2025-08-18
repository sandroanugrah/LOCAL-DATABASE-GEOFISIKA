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
exports.AirPressureController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const air_pressure_service_1 = require("./air-pressure.service");
const airPressureQueryDto_1 = require("./dto/airPressureQueryDto");
const edit_air_pressure_dto_1 = require("./dto/edit-air-pressure.dto");
const create_air_pressure_dto_1 = require("./dto/create-air-pressure.dto");
const getAirPressureQueryDto_1 = require("./dto/getAirPressureQueryDto");
const filterAirPressureByDateDto_1 = require("./dto/filterAirPressureByDateDto");
const create_air_pressure_excel_dto_1 = require("./dto/create-air-pressure-excel.dto");
let AirPressureController = class AirPressureController {
    airPressureService;
    constructor(airPressureService) {
        this.airPressureService = airPressureService;
    }
    async saveAirPressure(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.airPressureService.saveAirPressure(dto, ipAddress, userAgent);
        return result;
    }
    async saveaAirPressureExcel(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.airPressureService.saveExcelAirPressure(dto, ipAddress, userAgent);
        return result;
    }
    async updateAirPressure(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        const result = await this.airPressureService.updateAirPressure(dto, ipAddress, userAgent);
        return result;
    }
    async deleteAirPressure(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.airPressureService.deleteAirPressure(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getAllAirPressure() {
        return await this.airPressureService.getAllAirPressure();
    }
    async getAirPressure(querys) {
        const result = await this.airPressureService.getAirPressureById(querys.id);
        return result;
    }
    async getAirPressureByDate(query) {
        return await this.airPressureService.getAirPressureByDate(query);
    }
};
exports.AirPressureController = AirPressureController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_air_pressure_dto_1.CreateAirPressureDto]),
    __metadata("design:returntype", Promise)
], AirPressureController.prototype, "saveAirPressure", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_air_pressure_excel_dto_1.CreateAirPressureExcelDto]),
    __metadata("design:returntype", Promise)
], AirPressureController.prototype, "saveaAirPressureExcel", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_air_pressure_dto_1.EditAirPressureDto,
        airPressureQueryDto_1.AirPressureQueryDto]),
    __metadata("design:returntype", Promise)
], AirPressureController.prototype, "updateAirPressure", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil menghapus data tekanan udara' }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, airPressureQueryDto_1.AirPressureQueryDto]),
    __metadata("design:returntype", Promise)
], AirPressureController.prototype, "deleteAirPressure", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan semua data tekanan udara',
    }),
    (0, common_1.Get)('/get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AirPressureController.prototype, "getAllAirPressure", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data tekanan udara berdasarkan id',
    }),
    (0, common_1.Get)('/get'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getAirPressureQueryDto_1.GetAirPressureQueryDto]),
    __metadata("design:returntype", Promise)
], AirPressureController.prototype, "getAirPressure", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data tekanan udara berdasarkan rentang tanggal tekanan udara',
    }),
    (0, common_1.Get)('/get-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterAirPressureByDateDto_1.FilterAirPressureByDateDto]),
    __metadata("design:returntype", Promise)
], AirPressureController.prototype, "getAirPressureByDate", null);
exports.AirPressureController = AirPressureController = __decorate([
    (0, swagger_1.ApiTags)('Air Pressure'),
    (0, common_1.Controller)('air-pressure'),
    __metadata("design:paramtypes", [air_pressure_service_1.AirPressureService])
], AirPressureController);
//# sourceMappingURL=air-pressure.controller.js.map