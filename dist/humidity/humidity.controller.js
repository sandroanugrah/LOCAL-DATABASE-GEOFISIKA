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
exports.HumidityController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const humidity_service_1 = require("./humidity.service");
const humidityQueryDto_1 = require("./dto/humidityQueryDto");
const edit_humidity_dto_1 = require("./dto/edit-humidity.dto");
const create_humidity_dto_1 = require("./dto/create-humidity.dto");
const getHumidityQueryDto_1 = require("./dto/getHumidityQueryDto");
const filterHumidityByDateDto_1 = require("./dto/filterHumidityByDateDto");
const create_humidity_excel_dto_1 = require("./dto/create-humidity-excel.dto");
let HumidityController = class HumidityController {
    humidityService;
    constructor(humidityService) {
        this.humidityService = humidityService;
    }
    async saveHumidity(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.humidityService.saveHumidity(dto, ipAddress, userAgent);
        return result;
    }
    async saveHumidityExcel(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.humidityService.saveExcelHumidity(dto, ipAddress, userAgent);
        return result;
    }
    async updateHumidity(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        const result = await this.humidityService.updateHumidity(dto, ipAddress, userAgent);
        return result;
    }
    async deleteHumidity(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.humidityService.deleteHumidity(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getAllHumidity() {
        return await this.humidityService.getAllHumidity();
    }
    async getHumidityById(querys) {
        const result = await this.humidityService.getHumidityById(querys.id);
        return result;
    }
    async getHumidityByDate(query) {
        return await this.humidityService.getHumidityByDate(query);
    }
};
exports.HumidityController = HumidityController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_humidity_dto_1.CreateHumidityDto]),
    __metadata("design:returntype", Promise)
], HumidityController.prototype, "saveHumidity", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_humidity_excel_dto_1.CreateHumidityExcelDto]),
    __metadata("design:returntype", Promise)
], HumidityController.prototype, "saveHumidityExcel", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_humidity_dto_1.EditHumidityDto,
        humidityQueryDto_1.HumidityQueryDto]),
    __metadata("design:returntype", Promise)
], HumidityController.prototype, "updateHumidity", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil menghapus data kelembapan' }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, humidityQueryDto_1.HumidityQueryDto]),
    __metadata("design:returntype", Promise)
], HumidityController.prototype, "deleteHumidity", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil mendapatkan semua data kelembapan' }),
    (0, common_1.Get)('/get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HumidityController.prototype, "getAllHumidity", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data kelembapan berdasarkan id',
    }),
    (0, common_1.Get)('/get'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getHumidityQueryDto_1.GetHumidityQueryDto]),
    __metadata("design:returntype", Promise)
], HumidityController.prototype, "getHumidityById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data kelembapan berdasarkan rentang tanggal kelembapan',
    }),
    (0, common_1.Get)('/get-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterHumidityByDateDto_1.FilterHumidityByDateDto]),
    __metadata("design:returntype", Promise)
], HumidityController.prototype, "getHumidityByDate", null);
exports.HumidityController = HumidityController = __decorate([
    (0, swagger_1.ApiTags)('Humidity'),
    (0, common_1.Controller)('humidity'),
    __metadata("design:paramtypes", [humidity_service_1.HumidityService])
], HumidityController);
//# sourceMappingURL=humidity.controller.js.map