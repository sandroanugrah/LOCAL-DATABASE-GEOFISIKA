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
exports.TimeSignatureController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const time_signature_service_1 = require("./time-signature.service");
const timeSignatureQueryDto_1 = require("./dto/timeSignatureQueryDto");
const edit_time_signature_dto_1 = require("./dto/edit-time-signature.dto");
const create_time_signature_dto_1 = require("./dto/create-time-signature.dto");
const getTimeSignatureQueryDto_1 = require("./dto/getTimeSignatureQueryDto");
const filterTimeSignatureByDateDto_1 = require("./dto/filterTimeSignatureByDateDto");
const create_time_signature_excel_dto_1 = require("./dto/create-time-signature-excel.dto");
let TimeSignatureController = class TimeSignatureController {
    timeSignatureService;
    constructor(timeSignatureService) {
        this.timeSignatureService = timeSignatureService;
    }
    async saveTimeSignature(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.timeSignatureService.saveTimeSignature(dto, ipAddress, userAgent);
        return result;
    }
    async saveTimeSignatureExcel(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.timeSignatureService.saveExcelTimeSignature(dto, ipAddress, userAgent);
        return result;
    }
    async updateTimeSignature(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        const result = await this.timeSignatureService.updateTimeSignature(dto, ipAddress, userAgent);
        return result;
    }
    async deleteTimeSignature(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.timeSignatureService.deleteTimeSignature(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getAllTimeSignature() {
        const result = await this.timeSignatureService.getAllTimeSignature();
        return result;
    }
    async getMinTemperatureById(querys) {
        const result = await this.timeSignatureService.getTimeSignatureById(querys.id);
        return result;
    }
    async getTimeSignatureByDate(query) {
        return await this.timeSignatureService.getTimeSignatureByDate(query);
    }
};
exports.TimeSignatureController = TimeSignatureController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_time_signature_dto_1.CreateTimeSignatureDto]),
    __metadata("design:returntype", Promise)
], TimeSignatureController.prototype, "saveTimeSignature", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_time_signature_excel_dto_1.CreateTimeSignatureExcelDto]),
    __metadata("design:returntype", Promise)
], TimeSignatureController.prototype, "saveTimeSignatureExcel", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_time_signature_dto_1.EditTimeSignatureDto,
        timeSignatureQueryDto_1.TimeSignatureQueryDto]),
    __metadata("design:returntype", Promise)
], TimeSignatureController.prototype, "updateTimeSignature", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil menghapus data tanda waktu' }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, timeSignatureQueryDto_1.TimeSignatureQueryDto]),
    __metadata("design:returntype", Promise)
], TimeSignatureController.prototype, "deleteTimeSignature", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan semua data tanda waktu',
    }),
    (0, common_1.Get)('/get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TimeSignatureController.prototype, "getAllTimeSignature", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data tanda waktu berdasarkan id',
    }),
    (0, common_1.Get)('/get'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getTimeSignatureQueryDto_1.GetTimeSignatureQueryDto]),
    __metadata("design:returntype", Promise)
], TimeSignatureController.prototype, "getMinTemperatureById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data tanda waktu berdasarkan rentang tanggal',
    }),
    (0, common_1.Get)('/get-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterTimeSignatureByDateDto_1.FilterTimeSignatureByDateDto]),
    __metadata("design:returntype", Promise)
], TimeSignatureController.prototype, "getTimeSignatureByDate", null);
exports.TimeSignatureController = TimeSignatureController = __decorate([
    (0, swagger_1.ApiTags)('Time Signature'),
    (0, common_1.Controller)('time-signature'),
    __metadata("design:paramtypes", [time_signature_service_1.TimeSignatureService])
], TimeSignatureController);
//# sourceMappingURL=time-signature.controller.js.map