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
exports.RainyDaysController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const rainy_days_service_1 = require("./rainy-days.service");
const rainyDaysQueryDto_1 = require("./dto/rainyDaysQueryDto");
const edit_rainy_days_dto_1 = require("./dto/edit-rainy-days.dto");
const create_rainy_days_dto_1 = require("./dto/create-rainy-days.dto");
const getRainyDaysQueryDto_1 = require("./dto/getRainyDaysQueryDto");
const filterRainyDaysByDateDto_1 = require("./dto/filterRainyDaysByDateDto");
const create_rainy_days_excel_dto_1 = require("./dto/create-rainy-days-excel.dto");
let RainyDaysController = class RainyDaysController {
    rainyDaysService;
    constructor(rainyDaysService) {
        this.rainyDaysService = rainyDaysService;
    }
    async saveRainyDays(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.rainyDaysService.saveRainyDays(dto, ipAddress, userAgent);
        return result;
    }
    async saveRainyDaysExcel(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.rainyDaysService.saveExcelRainyDays(dto, ipAddress, userAgent);
        return result;
    }
    async updateRainyDays(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        return this.rainyDaysService.updateRainyDays(dto, ipAddress, userAgent);
    }
    async deleteRainyDays(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.rainyDaysService.deleteRainyDays(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getAllRainyDays() {
        const result = await this.rainyDaysService.getAllRainyDays();
        return result;
    }
    async getRainyDaysById(querys) {
        const result = await this.rainyDaysService.getRainyDaysById(querys.id);
        return result;
    }
    async getRainyDaysByDate(query) {
        return await this.rainyDaysService.getRainyDaysByDate(query);
    }
};
exports.RainyDaysController = RainyDaysController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_rainy_days_dto_1.CreateRainyDaysDto]),
    __metadata("design:returntype", Promise)
], RainyDaysController.prototype, "saveRainyDays", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_rainy_days_excel_dto_1.CreateRainyDaysExcelDto]),
    __metadata("design:returntype", Promise)
], RainyDaysController.prototype, "saveRainyDaysExcel", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_rainy_days_dto_1.EditRainyDaysDto,
        rainyDaysQueryDto_1.RainyDaysQueryDto]),
    __metadata("design:returntype", Promise)
], RainyDaysController.prototype, "updateRainyDays", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil menghapus data hari hujan' }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rainyDaysQueryDto_1.RainyDaysQueryDto]),
    __metadata("design:returntype", Promise)
], RainyDaysController.prototype, "deleteRainyDays", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan semua data hari hujan',
    }),
    (0, common_1.Get)(`/get-all`),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RainyDaysController.prototype, "getAllRainyDays", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data hari hujan berdasarkan id',
    }),
    (0, common_1.Get)(`/get`),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getRainyDaysQueryDto_1.GetRainyDaysQueryDto]),
    __metadata("design:returntype", Promise)
], RainyDaysController.prototype, "getRainyDaysById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data hari hujan berdasarkan rentang tanggal',
    }),
    (0, common_1.Get)('/get-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterRainyDaysByDateDto_1.FilterRainyDaysByDateDto]),
    __metadata("design:returntype", Promise)
], RainyDaysController.prototype, "getRainyDaysByDate", null);
exports.RainyDaysController = RainyDaysController = __decorate([
    (0, swagger_1.ApiTags)('Rainy Days'),
    (0, common_1.Controller)('rainy-days'),
    __metadata("design:paramtypes", [rainy_days_service_1.RainyDaysService])
], RainyDaysController);
//# sourceMappingURL=rainy-days.controller.js.map