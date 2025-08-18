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
exports.RainfallController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const rainfall_service_1 = require("./rainfall.service");
const rainfallQueryDto_1 = require("./dto/rainfallQueryDto");
const edit_rainfall_dto_1 = require("./dto/edit-rainfall.dto");
const create_rainfall_dto_1 = require("./dto/create-rainfall.dto");
const getRainfallQueryDto_1 = require("./dto/getRainfallQueryDto");
const filterRainfallByDateDto_1 = require("./dto/filterRainfallByDateDto");
const create_rainfall_excel_dto_1 = require("./dto/create-rainfall-excel.dto");
let RainfallController = class RainfallController {
    rainfallService;
    constructor(rainfallService) {
        this.rainfallService = rainfallService;
    }
    async saveRainfall(req, userId, dto) {
        if (!userId || typeof userId !== 'string' || userId.trim() === '') {
            throw new common_1.BadRequestException('user_id wajib diisi sebagai query param dan harus berupa string');
        }
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.rainfallService.saveRainfall(dto, ipAddress, userAgent);
        return result;
    }
    async saveRainfallExcel(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.rainfallService.saveExcelRainfall(dto, ipAddress, userAgent);
        return result;
    }
    async updateRainfall(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        const result = await this.rainfallService.updateRainfall(dto, ipAddress, userAgent);
        return result;
    }
    async deleteRainfall(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.rainfallService.deleteRainfall(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getAllRainfall() {
        const result = await this.rainfallService.getAllRainfall();
        return result;
    }
    async getRainfallById(querys) {
        const result = await this.rainfallService.getRainfallById(querys.id);
        return result;
    }
    async getRainfallByDate(query) {
        return await this.rainfallService.getRainfallByDate(query);
    }
};
exports.RainfallController = RainfallController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_rainfall_dto_1.CreateRainfallDto]),
    __metadata("design:returntype", Promise)
], RainfallController.prototype, "saveRainfall", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_rainfall_excel_dto_1.CreateRainfallExcelDto]),
    __metadata("design:returntype", Promise)
], RainfallController.prototype, "saveRainfallExcel", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_rainfall_dto_1.EditRainfallDto,
        rainfallQueryDto_1.RainfallQueryDto]),
    __metadata("design:returntype", Promise)
], RainfallController.prototype, "updateRainfall", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil menghapus data curah hujan' }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rainfallQueryDto_1.RainfallQueryDto]),
    __metadata("design:returntype", Promise)
], RainfallController.prototype, "deleteRainfall", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan semua data curah hujan',
    }),
    (0, common_1.Get)('/get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RainfallController.prototype, "getAllRainfall", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data curah hujan berdasarkan id',
    }),
    (0, common_1.Get)('/get'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getRainfallQueryDto_1.GetRainfallQueryDto]),
    __metadata("design:returntype", Promise)
], RainfallController.prototype, "getRainfallById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data curah hujan berdasarkan rentang tanggal',
    }),
    (0, common_1.Get)('/get-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterRainfallByDateDto_1.FilterRainfallByDateDto]),
    __metadata("design:returntype", Promise)
], RainfallController.prototype, "getRainfallByDate", null);
exports.RainfallController = RainfallController = __decorate([
    (0, swagger_1.ApiTags)('Rainfall'),
    (0, common_1.Controller)('rainfall'),
    __metadata("design:paramtypes", [rainfall_service_1.RainfallService])
], RainfallController);
//# sourceMappingURL=rainfall.controller.js.map