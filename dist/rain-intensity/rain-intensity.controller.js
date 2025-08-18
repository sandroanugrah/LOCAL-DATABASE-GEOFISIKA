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
exports.RainIntensityController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const rain_intensity_service_1 = require("./rain-intensity.service");
const rainIntensityQueryDto_1 = require("./dto/rainIntensityQueryDto");
const edit_rain_intensity_dto_1 = require("./dto/edit-rain-intensity.dto");
const create_rain_intensity_dto_1 = require("./dto/create-rain-intensity.dto");
const getRainIntensityQueryDto_1 = require("./dto/getRainIntensityQueryDto");
const filterRainIntensityByDateDto_1 = require("./dto/filterRainIntensityByDateDto");
const create_rain_intensity_excel_dto_1 = require("./dto/create-rain-intensity-excel.dto");
let RainIntensityController = class RainIntensityController {
    rainIntensityService;
    constructor(rainIntensityService) {
        this.rainIntensityService = rainIntensityService;
    }
    async saveRainIntensity(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.rainIntensityService.saveRainIntensity(dto, ipAddress, userAgent);
        return result;
    }
    async saveRainIntensityExcel(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.rainIntensityService.saveExcelRainIntensity(dto, ipAddress, userAgent);
        return result;
    }
    async updateRainIntensity(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        const result = await this.rainIntensityService.updateRainIntensity(dto, ipAddress, userAgent);
        return result;
    }
    async deleteRainIntensity(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.rainIntensityService.deleteRainIntensity(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getAllRainIntensity() {
        const result = await this.rainIntensityService.getAllRainIntensity();
        return result;
    }
    async getRainIntensityById(querys) {
        const result = await this.rainIntensityService.getRainIntensityById(querys.id);
        return result;
    }
    async getRainIntensityByDate(query) {
        return await this.rainIntensityService.getRainIntensityByDate(query);
    }
};
exports.RainIntensityController = RainIntensityController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_rain_intensity_dto_1.CreateRainIntensityDto]),
    __metadata("design:returntype", Promise)
], RainIntensityController.prototype, "saveRainIntensity", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_rain_intensity_excel_dto_1.CreateRainIntensityExcelDto]),
    __metadata("design:returntype", Promise)
], RainIntensityController.prototype, "saveRainIntensityExcel", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_rain_intensity_dto_1.EditRainIntensityDto,
        rainIntensityQueryDto_1.RainIntensityQueryDto]),
    __metadata("design:returntype", Promise)
], RainIntensityController.prototype, "updateRainIntensity", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil menghapus data intensitas hujan' }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rainIntensityQueryDto_1.RainIntensityQueryDto]),
    __metadata("design:returntype", Promise)
], RainIntensityController.prototype, "deleteRainIntensity", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan semua data intensitas hujan',
    }),
    (0, common_1.Get)('/get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RainIntensityController.prototype, "getAllRainIntensity", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data intensitas hujan berdasarkan id',
    }),
    (0, common_1.Get)('/get'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getRainIntensityQueryDto_1.GetRainIntensityQueryDto]),
    __metadata("design:returntype", Promise)
], RainIntensityController.prototype, "getRainIntensityById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data intensitas hujan berdasarkan rentang tanggal',
    }),
    (0, common_1.Get)('/get-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterRainIntensityByDateDto_1.FilterRainIntensityByDateDto]),
    __metadata("design:returntype", Promise)
], RainIntensityController.prototype, "getRainIntensityByDate", null);
exports.RainIntensityController = RainIntensityController = __decorate([
    (0, swagger_1.ApiTags)('Rain Intensity'),
    (0, common_1.Controller)('rain-intensity'),
    __metadata("design:paramtypes", [rain_intensity_service_1.RainIntensityService])
], RainIntensityController);
//# sourceMappingURL=rain-intensity.controller.js.map