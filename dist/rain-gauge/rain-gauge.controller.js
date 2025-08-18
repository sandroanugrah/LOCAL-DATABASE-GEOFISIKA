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
exports.RainGaugeController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const rain_gauge_service_1 = require("./rain-gauge.service");
const rainGaugeQueryDto_1 = require("./dto/rainGaugeQueryDto");
const edit_rain_gauge_dto_1 = require("./dto/edit-rain-gauge.dto");
const filter_rain_gauge_dto_1 = require("./dto/filter-rain-gauge.dto");
const create_rain_gauge_dto_1 = require("./dto/create-rain-gauge.dto");
const getRainGaugeQueryDto_1 = require("./dto/getRainGaugeQueryDto");
const edit_rain_gauge_query_dto_1 = require("./dto/edit-rain-gauge-query.dto");
const filterRainGaugeByDateDto_1 = require("./dto/filterRainGaugeByDateDto");
const create_rain_gauge_excel_dto_1 = require("./dto/create-rain-gauge-excel.dto");
const create_rain_gauge_query_dto_1 = require("./dto/create-rain-gauge-query.dto");
const create_rain_gauge_query_excel_dto_1 = require("./dto/create-rain-gauge-query-excel-dto");
let RainGaugeController = class RainGaugeController {
    rainGaugeService;
    constructor(rainGaugeService) {
        this.rainGaugeService = rainGaugeService;
    }
    async saveRainGauge(req, dtoQuery, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        const result = await this.rainGaugeService.saveRainGauge(dto, dtoQuery, ipAddress, userAgent);
        return result;
    }
    async saveExcelRainGauge(req, dtoQuery, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        const result = await this.rainGaugeService.saveExcelRainGauge(dto, dtoQuery, ipAddress, userAgent);
        return result;
    }
    async updateRainGauge(req, dtoQuery, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        const result = await this.rainGaugeService.updateRainGauge(dto, dtoQuery, ipAddress, userAgent);
        return result;
    }
    async deleteRainGauge(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.rainGaugeService.deleteRainGauge(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getRainGaugeById(query) {
        const result = await this.rainGaugeService.getRainGaugeById(query);
        return result;
    }
    async getRainGaugeByDate(query) {
        return await this.rainGaugeService.getRainGaugeByDate(query);
    }
    async getRainGaugeByCityVillage(query) {
        return await this.rainGaugeService.getRainGaugeByCityVillage(query);
    }
};
exports.RainGaugeController = RainGaugeController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_rain_gauge_query_dto_1.CreateRainGaugeQueryDto,
        create_rain_gauge_dto_1.CreateRainGaugeDto]),
    __metadata("design:returntype", Promise)
], RainGaugeController.prototype, "saveRainGauge", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_rain_gauge_query_excel_dto_1.CreateRainGaugeQueryExcelDto,
        create_rain_gauge_excel_dto_1.CreateRainGaugeExcelDto]),
    __metadata("design:returntype", Promise)
], RainGaugeController.prototype, "saveExcelRainGauge", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_rain_gauge_query_dto_1.EditRainGaugeQueryDto,
        edit_rain_gauge_dto_1.EditRainGaugeDto]),
    __metadata("design:returntype", Promise)
], RainGaugeController.prototype, "updateRainGauge", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil menghapus data pos hujan' }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rainGaugeQueryDto_1.RainGaugeQueryDto]),
    __metadata("design:returntype", Promise)
], RainGaugeController.prototype, "deleteRainGauge", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data pos hujan berdasarkan id',
    }),
    (0, common_1.Get)('/get-by-id'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getRainGaugeQueryDto_1.GetRainGaugeQueryDto]),
    __metadata("design:returntype", Promise)
], RainGaugeController.prototype, "getRainGaugeById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data pos hujan berdasarkan rentang tanggal',
    }),
    (0, common_1.Get)('/get-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterRainGaugeByDateDto_1.FilterRainGaugeByDateDto]),
    __metadata("design:returntype", Promise)
], RainGaugeController.prototype, "getRainGaugeByDate", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data pos hujan berdasarkan kota dan/atau desa',
    }),
    (0, common_1.Get)('/get-by-city-village'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_rain_gauge_dto_1.FilterRainGaugeDto]),
    __metadata("design:returntype", Promise)
], RainGaugeController.prototype, "getRainGaugeByCityVillage", null);
exports.RainGaugeController = RainGaugeController = __decorate([
    (0, swagger_1.ApiTags)('Rain Gauge'),
    (0, common_1.Controller)('rain-gauge'),
    __metadata("design:paramtypes", [rain_gauge_service_1.RainGaugeService])
], RainGaugeController);
//# sourceMappingURL=rain-gauge.controller.js.map