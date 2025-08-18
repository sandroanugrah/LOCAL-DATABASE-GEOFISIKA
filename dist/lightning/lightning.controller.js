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
exports.LightningController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const lightning_service_1 = require("./lightning.service");
const lightningQueryDto_1 = require("./dto/lightningQueryDto");
const edit_lightning_dto_1 = require("./dto/edit-lightning.dto");
const create_lightning_dto_1 = require("./dto/create-lightning.dto");
const getLightningQueryDto_1 = require("./dto/getLightningQueryDto");
const filterLightningByDateDto_1 = require("./dto/filterLightningByDateDto");
const create_lightning_excel_dto_1 = require("./dto/create-lightning-excel.dto");
const create_lightning_query_dto_1 = require("./dto/create-lightning-query-dto");
const create_lightning_query_excel_dto_1 = require("./dto/create-lightning-query-excel-dto");
const filterLightningByLightningDataDto_1 = require("./dto/filterLightningByLightningDataDto");
let LightningController = class LightningController {
    lightningService;
    constructor(lightningService) {
        this.lightningService = lightningService;
    }
    async saveLightning(req, dtoQuery, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        const result = await this.lightningService.saveLightning(dto, dtoQuery, ipAddress, userAgent);
        return result;
    }
    async saveLightningExcel(req, dtoQuery, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        const result = await this.lightningService.saveExcelLightning(dto, dtoQuery, ipAddress, userAgent);
        return result;
    }
    async updateLightning(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        const result = await this.lightningService.updateLightning(dto, ipAddress, userAgent);
        return result;
    }
    async deleteLightning(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.lightningService.deleteLightning(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getLightning(querys) {
        const result = await this.lightningService.getLightningById(querys);
        return result;
    }
    async getLightningByDate(query) {
        return await this.lightningService.getLightningByDate(query);
    }
    async getLightningByLightningData(query) {
        return await this.lightningService.getLightningByLightningData(query);
    }
};
exports.LightningController = LightningController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_lightning_query_dto_1.CreateLightningQueryDto,
        create_lightning_dto_1.CreateLightningDto]),
    __metadata("design:returntype", Promise)
], LightningController.prototype, "saveLightning", null);
__decorate([
    (0, common_1.Post)('/insert-excel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_lightning_query_excel_dto_1.CreateLightningQueryExcelDto,
        create_lightning_excel_dto_1.CreateLightningExcelDto]),
    __metadata("design:returntype", Promise)
], LightningController.prototype, "saveLightningExcel", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_lightning_dto_1.EditLightningDto,
        lightningQueryDto_1.LightningQueryDto]),
    __metadata("design:returntype", Promise)
], LightningController.prototype, "updateLightning", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil menghapus data petir' }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, lightningQueryDto_1.LightningQueryDto]),
    __metadata("design:returntype", Promise)
], LightningController.prototype, "deleteLightning", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan semua data petir',
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data petir berdasarkan id',
    }),
    (0, common_1.Get)('/get-by-id'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getLightningQueryDto_1.GetLightningQueryDto]),
    __metadata("design:returntype", Promise)
], LightningController.prototype, "getLightning", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data petir berdasarkan rentang tanggal',
    }),
    (0, common_1.Get)('/get-by-date'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterLightningByDateDto_1.FilterLightningByDateDto]),
    __metadata("design:returntype", Promise)
], LightningController.prototype, "getLightningByDate", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data petir berdasarkan nama data',
    }),
    (0, common_1.Get)('/get-by-lightning-data'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterLightningByLightningDataDto_1.FilterLightningByLightningDataDto]),
    __metadata("design:returntype", Promise)
], LightningController.prototype, "getLightningByLightningData", null);
exports.LightningController = LightningController = __decorate([
    (0, swagger_1.ApiTags)('Lightning'),
    (0, common_1.Controller)('lightning'),
    __metadata("design:paramtypes", [lightning_service_1.LightningService])
], LightningController);
//# sourceMappingURL=lightning.controller.js.map