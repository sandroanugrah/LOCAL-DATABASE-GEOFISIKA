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
exports.WindDirectionAndSpeedController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const wind_direction_and_speed_service_1 = require("./wind-direction-and-speed.service");
const windDirectionAndSpeedQueryDto_1 = require("./dto/windDirectionAndSpeedQueryDto");
const edit_wind_direction_and_speed_dto_1 = require("./dto/edit-wind-direction-and-speed.dto");
const getWindDirectionAndSpeedQueryDto_1 = require("./dto/getWindDirectionAndSpeedQueryDto");
const create_wind_direction_and_speed_dto_1 = require("./dto/create-wind-direction-and-speed.dto");
const filterWindDirectionAndSpeedByDateDto_1 = require("./dto/filterWindDirectionAndSpeedByDateDto");
const create_wind_direction_and_speed_excel_dto_1 = require("./dto/create-wind-direction-and-speed-excel.dto");
let WindDirectionAndSpeedController = class WindDirectionAndSpeedController {
    windDirectionAndSpeedService;
    constructor(windDirectionAndSpeedService) {
        this.windDirectionAndSpeedService = windDirectionAndSpeedService;
    }
    async saveWindDirectionAndSpeed(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.windDirectionAndSpeedService.saveWindDirectionAndSpeed(dto, ipAddress, userAgent);
        return result;
    }
    async saveExcelWindDirectionAndSpeed(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.windDirectionAndSpeedService.saveExcelWindDirectionAndSpeed(dto, ipAddress, userAgent);
        return result;
    }
    async updateWindDirectionAndSpeed(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        const result = await this.windDirectionAndSpeedService.updateWindDirectionAndSpeed(dto, ipAddress, userAgent);
        return result;
    }
    async deleteWindDirectionAndSpeed(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.windDirectionAndSpeedService.deleteWindDirectionAndSpeed(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getAllWindDirectionAndSpeed() {
        return await this.windDirectionAndSpeedService.getAllWindDirectionAndSpeed();
    }
    async getWindDirectionAndSpeedById(querys) {
        const result = await this.windDirectionAndSpeedService.getWindDirectionAndSpeedById(querys.id);
        return result;
    }
    async getWindDirectionAndSpeedByDate(query) {
        return await this.windDirectionAndSpeedService.getWindDirectionAndSpeedByDate(query);
    }
};
exports.WindDirectionAndSpeedController = WindDirectionAndSpeedController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_wind_direction_and_speed_dto_1.CreateWindDirectionAndSpeedDto]),
    __metadata("design:returntype", Promise)
], WindDirectionAndSpeedController.prototype, "saveWindDirectionAndSpeed", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_wind_direction_and_speed_excel_dto_1.CreateWindDirectionAndSpeedExcelDto]),
    __metadata("design:returntype", Promise)
], WindDirectionAndSpeedController.prototype, "saveExcelWindDirectionAndSpeed", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_wind_direction_and_speed_dto_1.EditWindDirectionAndSpeedDto,
        windDirectionAndSpeedQueryDto_1.WindDirectionAndSpeedQueryDto]),
    __metadata("design:returntype", Promise)
], WindDirectionAndSpeedController.prototype, "updateWindDirectionAndSpeed", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil menghapus data arah dan kecepatan angin',
    }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, windDirectionAndSpeedQueryDto_1.WindDirectionAndSpeedQueryDto]),
    __metadata("design:returntype", Promise)
], WindDirectionAndSpeedController.prototype, "deleteWindDirectionAndSpeed", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan semua data arah dan kecepatan angin',
    }),
    (0, common_1.Get)('/get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WindDirectionAndSpeedController.prototype, "getAllWindDirectionAndSpeed", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data arah dan kecepatan angin berdasarkan id',
    }),
    (0, common_1.Get)('/get'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getWindDirectionAndSpeedQueryDto_1.GetWindDirectionAndSpeedQueryDto]),
    __metadata("design:returntype", Promise)
], WindDirectionAndSpeedController.prototype, "getWindDirectionAndSpeedById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data arah dan kecepatan angin berdasarkan rentang tanggal arah dan kecepatan angin',
    }),
    (0, common_1.Get)('/get-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterWindDirectionAndSpeedByDateDto_1.FilterWindDirectionAndSpeedByDateDto]),
    __metadata("design:returntype", Promise)
], WindDirectionAndSpeedController.prototype, "getWindDirectionAndSpeedByDate", null);
exports.WindDirectionAndSpeedController = WindDirectionAndSpeedController = __decorate([
    (0, swagger_1.ApiTags)('Wind Direction And Speed'),
    (0, swagger_1.ApiOkResponse)(),
    (0, common_1.Controller)('wind-direction-and-speed'),
    __metadata("design:paramtypes", [wind_direction_and_speed_service_1.WindDirectionAndSpeedService])
], WindDirectionAndSpeedController);
//# sourceMappingURL=wind-direction-and-speed.controller.js.map