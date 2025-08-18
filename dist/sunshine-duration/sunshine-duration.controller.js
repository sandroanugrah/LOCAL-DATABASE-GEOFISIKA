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
exports.SunshineDurationController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const sunshine_duration_service_1 = require("./sunshine-duration.service");
const sunshineDurationQueryDto_1 = require("./dto/sunshineDurationQueryDto");
const edit_sunshine_duration_dto_1 = require("./dto/edit-sunshine-duration.dto");
const create_sunshine_duration_dto_1 = require("./dto/create-sunshine-duration.dto");
const getSunshineDurationQueryDto_1 = require("./dto/getSunshineDurationQueryDto");
const filterSunShineDurationByDateDto_1 = require("./dto/filterSunShineDurationByDateDto");
const create_sunshine_duration_excel_dto_1 = require("./dto/create-sunshine-duration-excel.dto");
let SunshineDurationController = class SunshineDurationController {
    sunshineDurationService;
    constructor(sunshineDurationService) {
        this.sunshineDurationService = sunshineDurationService;
    }
    async saveSunshineDuration(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.sunshineDurationService.saveSunshineDuration(dto, ipAddress, userAgent);
        return result;
    }
    async saveSunshineDurationExcel(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.sunshineDurationService.saveExcelSunshineDuration(dto, ipAddress, userAgent);
        return result;
    }
    async updateSunshineDuration(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        const result = await this.sunshineDurationService.updateSunshineDuration(dto, ipAddress, userAgent);
        return result;
    }
    async deleteSunshineDuration(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.sunshineDurationService.deleteSunshineDuration(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getAllSunshineDuration() {
        const result = await this.sunshineDurationService.getAllSunshineDuration();
        return result;
    }
    async getSunshineDurationById(querys) {
        const result = await this.sunshineDurationService.getSunshineDurationById(querys.id);
        return result;
    }
    async getSunshineDurationByDate(query) {
        return await this.sunshineDurationService.getSunshineDurationByDate(query);
    }
};
exports.SunshineDurationController = SunshineDurationController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_sunshine_duration_dto_1.CreateSunshineDurationDto]),
    __metadata("design:returntype", Promise)
], SunshineDurationController.prototype, "saveSunshineDuration", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_sunshine_duration_excel_dto_1.CreateSunshineDurationExcelDto]),
    __metadata("design:returntype", Promise)
], SunshineDurationController.prototype, "saveSunshineDurationExcel", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_sunshine_duration_dto_1.EditSunshineDurationDto,
        sunshineDurationQueryDto_1.SunshineDurationQueryDto]),
    __metadata("design:returntype", Promise)
], SunshineDurationController.prototype, "updateSunshineDuration", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil menghapus data durasi matahari terbit',
    }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, sunshineDurationQueryDto_1.SunshineDurationQueryDto]),
    __metadata("design:returntype", Promise)
], SunshineDurationController.prototype, "deleteSunshineDuration", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan semua data durasi matahari terbit',
    }),
    (0, common_1.Get)('/get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SunshineDurationController.prototype, "getAllSunshineDuration", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data durasi matahari terbit berdasarkan id',
    }),
    (0, common_1.Get)('/get'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getSunshineDurationQueryDto_1.GetSunshineDurationQueryDto]),
    __metadata("design:returntype", Promise)
], SunshineDurationController.prototype, "getSunshineDurationById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data durasi matahari terbit berdasarkan rentang tanggal',
    }),
    (0, common_1.Get)('/get-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterSunShineDurationByDateDto_1.FilterSunShineDurationByDateDto]),
    __metadata("design:returntype", Promise)
], SunshineDurationController.prototype, "getSunshineDurationByDate", null);
exports.SunshineDurationController = SunshineDurationController = __decorate([
    (0, swagger_1.ApiTags)('Sunshine Duration'),
    (0, common_1.Controller)('sunshine-duration'),
    __metadata("design:paramtypes", [sunshine_duration_service_1.SunshineDurationService])
], SunshineDurationController);
//# sourceMappingURL=sunshine-duration.controller.js.map