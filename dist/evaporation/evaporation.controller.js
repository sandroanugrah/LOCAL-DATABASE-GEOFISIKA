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
exports.EvaporationController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const evaporation_service_1 = require("./evaporation.service");
const edit_evaporation_dto_1 = require("./dto/edit-evaporation.dto");
const qevaporationQueryDto_1 = require("./dto/qevaporationQueryDto");
const create_evaporation_dto_1 = require("./dto/create-evaporation.dto");
const getEvaporationQueryDto_1 = require("./dto/getEvaporationQueryDto");
const filterEvaporationByDateDto_1 = require("./dto/filterEvaporationByDateDto");
const create_evaporation_excel_dto_1 = require("./dto/create-evaporation-excel.dto");
let EvaporationController = class EvaporationController {
    evaporationService;
    constructor(evaporationService) {
        this.evaporationService = evaporationService;
    }
    async saveEvaporation(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.evaporationService.saveEvaporation(dto, ipAddress, userAgent);
        return result;
    }
    async saveEvaporationExcel(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.evaporationService.saveExcelEvaporation(dto, ipAddress, userAgent);
        return result;
    }
    async updateEvaporation(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        const result = await this.evaporationService.updateEvaporation(dto, ipAddress, userAgent);
        return result;
    }
    async deleteEvaporation(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.evaporationService.deleteEvaporation(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getAllEvaporation() {
        return await this.evaporationService.getAllEvaporation();
    }
    async getEvaporationById(querys) {
        const result = await this.evaporationService.getEvaporationById(querys.id);
        return result;
    }
    async getEvaporationByDate(query) {
        return await this.evaporationService.getEvaporationByDate(query);
    }
};
exports.EvaporationController = EvaporationController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_evaporation_dto_1.CreateEvaporationDto]),
    __metadata("design:returntype", Promise)
], EvaporationController.prototype, "saveEvaporation", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_evaporation_excel_dto_1.CreateEvaporationExcelDto]),
    __metadata("design:returntype", Promise)
], EvaporationController.prototype, "saveEvaporationExcel", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_evaporation_dto_1.EditEvaporationDto,
        qevaporationQueryDto_1.EvaporationQueryDto]),
    __metadata("design:returntype", Promise)
], EvaporationController.prototype, "updateEvaporation", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil menghapus data penguapan' }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, qevaporationQueryDto_1.EvaporationQueryDto]),
    __metadata("design:returntype", Promise)
], EvaporationController.prototype, "deleteEvaporation", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil mendapatkan semua data penguapan' }),
    (0, common_1.Get)('/get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EvaporationController.prototype, "getAllEvaporation", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data penguapan berdasarkan id',
    }),
    (0, common_1.Get)('/get'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getEvaporationQueryDto_1.GetEvaporationQueryDto]),
    __metadata("design:returntype", Promise)
], EvaporationController.prototype, "getEvaporationById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data penguapan berdasarkan rentang tanggal',
    }),
    (0, common_1.Get)('/get-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterEvaporationByDateDto_1.FilterEvaporationByDateDto]),
    __metadata("design:returntype", Promise)
], EvaporationController.prototype, "getEvaporationByDate", null);
exports.EvaporationController = EvaporationController = __decorate([
    (0, swagger_1.ApiTags)('Evaporation'),
    (0, common_1.Controller)('evaporation'),
    __metadata("design:paramtypes", [evaporation_service_1.EvaporationService])
], EvaporationController);
//# sourceMappingURL=evaporation.controller.js.map