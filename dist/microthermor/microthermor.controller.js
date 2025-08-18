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
exports.MicrothermorController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const microthermor_service_1 = require("./microthermor.service");
const edit_microthermor_dto_1 = require("./dto/edit-microthermor.dto");
const microthermorQueryDto_1 = require("./dto/microthermorQueryDto");
const create_microthermor_dto_1 = require("./dto/create-microthermor.dto");
const getMicrothermorQueryDto_1 = require("./dto/getMicrothermorQueryDto");
const getMicrothermorQueryByMinMaxTDOMDto_1 = require("./dto/getMicrothermorQueryByMinMaxTDOMDto");
let MicrothermorController = class MicrothermorController {
    microthermorService;
    constructor(microthermorService) {
        this.microthermorService = microthermorService;
    }
    async saveMicrothermor(req, userId, dto) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = userId;
        const result = await this.microthermorService.saveMicrothermor(dto, ipAddress, userAgent);
        return result;
    }
    async updateMicrothermor(req, dto, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        dto.user_id = querys.user_id;
        dto.id = querys.id;
        const result = await this.microthermorService.updateMicrothermor(dto, ipAddress, userAgent);
        return result;
    }
    async deleteMicrothermor(req, querys) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return await this.microthermorService.deleteMicrothermor(querys.id, querys.user_id, ipAddress, userAgent);
    }
    async getAllMicrothermor() {
        return await this.microthermorService.getAllMicrothermor();
    }
    async getMicrothermorById(querys) {
        const result = await this.microthermorService.getMicrothermorById(querys.id);
        return result;
    }
    async getMicrothermorByMaxMinTDOM(query) {
        const result = await this.microthermorService.getMicrothermorByMaxMinTDOM(query);
        return result;
    }
};
exports.MicrothermorController = MicrothermorController;
__decorate([
    (0, common_1.Post)('/insert'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_microthermor_dto_1.CreateMicrothermorDto]),
    __metadata("design:returntype", Promise)
], MicrothermorController.prototype, "saveMicrothermor", null);
__decorate([
    (0, common_1.Put)('/update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, edit_microthermor_dto_1.EditMicrothermorDto,
        microthermorQueryDto_1.MicrothermorQueryDto]),
    __metadata("design:returntype", Promise)
], MicrothermorController.prototype, "updateMicrothermor", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil menghapus data mikrotremor' }),
    (0, common_1.Delete)('/delete'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, microthermorQueryDto_1.MicrothermorQueryDto]),
    __metadata("design:returntype", Promise)
], MicrothermorController.prototype, "deleteMicrothermor", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil mendapatkan semua data mikrotremor' }),
    (0, common_1.Get)('/get-all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MicrothermorController.prototype, "getAllMicrothermor", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data mikrotremor berdasarkan id',
    }),
    (0, common_1.Get)('/get'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getMicrothermorQueryDto_1.GetMicrothermorQueryDto]),
    __metadata("design:returntype", Promise)
], MicrothermorController.prototype, "getMicrothermorById", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan data mikrotremor berdasarkan TDOM',
    }),
    (0, common_1.Get)('/get-by-TDOM'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getMicrothermorQueryByMinMaxTDOMDto_1.GetMicrothermorQueryByMinMaxTDOMDto]),
    __metadata("design:returntype", Promise)
], MicrothermorController.prototype, "getMicrothermorByMaxMinTDOM", null);
exports.MicrothermorController = MicrothermorController = __decorate([
    (0, swagger_1.ApiTags)('Microthermor'),
    (0, common_1.Controller)('microthermor'),
    __metadata("design:paramtypes", [microthermor_service_1.MicrothermorService])
], MicrothermorController);
//# sourceMappingURL=microthermor.controller.js.map