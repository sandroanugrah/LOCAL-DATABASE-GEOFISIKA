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
exports.EarthquakeController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const earthquake_service_1 = require("./earthquake.service");
const earthquakeQueryDto_1 = require("./dto/earthquakeQueryDto");
const edit_earthquake_dto_1 = require("./dto/edit-earthquake.dto");
const create_earthquake_dto_1 = require("./dto/create-earthquake.dto");
const getEarthquakeQueryDto_1 = require("./dto/getEarthquakeQueryDto");
const filterEarthquakeByDateDto_1 = require("./dto/filterEarthquakeByDateDto");
const create_earthquake_parse_dto_1 = require("./dto/create-earthquake-parse.dto");
const create_earthquake_excel_dto_1 = require("./dto/create-earthquake-excel.dto");
let EarthquakeController = class EarthquakeController {
    earthquakeService;
    constructor(earthquakeService) {
        this.earthquakeService = earthquakeService;
    }
    async saveEarthquake(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.earthquakeService.saveEarthquake(dto, ipAddress, userAgent);
        return result;
    }
    async saveEarthquakeExcel(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.earthquakeService.saveExcelEarthquake(dto, ipAddress, userAgent);
        return result;
    }
    async saveEarthquakeParse(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.earthquakeService.saveEarthquakeParse(dto, ipAddress, userAgent);
        return result;
    }
    async updateEarthquake(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        const result = await this.earthquakeService.updateEarthquake(dto, ipAddress, userAgent);
        return result;
    }
    async deleteEarthquake(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.earthquakeService.deleteEarthquake(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getAllEarthquake() {
        const result = await this.earthquakeService.getAllEarthquake();
        return result;
    }
    async getEarthquakeById(querys) {
        const result = await this.earthquakeService.getEarthquakeById(querys.id);
        return result;
    }
    async getEarthquakeByAllData(query) {
        return await this.earthquakeService.getEarthquakeByAllData(query);
    }
};
exports.EarthquakeController = EarthquakeController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_earthquake_dto_1.CreateEarthquakeDto]),
    __metadata("design:returntype", Promise)
], EarthquakeController.prototype, "saveEarthquake", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_earthquake_excel_dto_1.CreateEarthquakeExcelDto]),
    __metadata("design:returntype", Promise)
], EarthquakeController.prototype, "saveEarthquakeExcel", null);
__decorate([
    (0, common_1.Post)('/insert-parse'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_earthquake_parse_dto_1.CreateEarthquakeParseDto]),
    __metadata("design:returntype", Promise)
], EarthquakeController.prototype, "saveEarthquakeParse", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_earthquake_dto_1.EditEarthquakeDto,
        earthquakeQueryDto_1.EarthquakeQueryDto]),
    __metadata("design:returntype", Promise)
], EarthquakeController.prototype, "updateEarthquake", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil menghapus data gempa' }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, earthquakeQueryDto_1.EarthquakeQueryDto]),
    __metadata("design:returntype", Promise)
], EarthquakeController.prototype, "deleteEarthquake", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan semua data gempa',
    }),
    (0, common_1.Get)('/get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EarthquakeController.prototype, "getAllEarthquake", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data gempa berdasarkan id',
    }),
    (0, common_1.Get)('/get'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getEarthquakeQueryDto_1.GetEarthquakeQueryDto]),
    __metadata("design:returntype", Promise)
], EarthquakeController.prototype, "getEarthquakeById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data gempa berdasarkan rentang data',
    }),
    (0, common_1.Get)('/get-by-all-data'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterEarthquakeByDateDto_1.FilterEarthquakeByDateDto]),
    __metadata("design:returntype", Promise)
], EarthquakeController.prototype, "getEarthquakeByAllData", null);
exports.EarthquakeController = EarthquakeController = __decorate([
    (0, swagger_1.ApiTags)('Earthquake'),
    (0, common_1.Controller)('earthquake'),
    __metadata("design:paramtypes", [earthquake_service_1.EarthquakeService])
], EarthquakeController);
//# sourceMappingURL=earthquake.controller.js.map