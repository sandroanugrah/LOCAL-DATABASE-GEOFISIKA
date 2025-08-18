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
exports.LoginLogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const login_log_service_1 = require("./login-log.service");
const create_login_log_dto_1 = require("./dto/create-login-log.dto");
let LoginLogController = class LoginLogController {
    loginLogService;
    constructor(loginLogService) {
        this.loginLogService = loginLogService;
    }
    async createLog(dto) {
        return await this.loginLogService.logLogin(dto);
    }
    async getAllLog() {
        return await this.loginLogService.getAllLoginLog();
    }
    async getLogByUserId(user_id) {
        return await this.loginLogService.getLoginLogByUserId(user_id);
    }
};
exports.LoginLogController = LoginLogController;
__decorate([
    (0, swagger_1.ApiExcludeEndpoint)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_login_log_dto_1.CreateLoginLogDto]),
    __metadata("design:returntype", Promise)
], LoginLogController.prototype, "createLog", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil mendapatkan semua login log' }),
    (0, common_1.Get)(`/get-all`),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LoginLogController.prototype, "getAllLog", null);
__decorate([
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mendapatkan login log berdasarkan user_id',
    }),
    (0, common_1.Get)('/get'),
    __param(0, (0, common_1.Query)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoginLogController.prototype, "getLogByUserId", null);
exports.LoginLogController = LoginLogController = __decorate([
    (0, swagger_1.ApiTags)('Login Log'),
    (0, common_1.Controller)('login-log'),
    __metadata("design:paramtypes", [login_log_service_1.LoginLogService])
], LoginLogController);
//# sourceMappingURL=login-log.controller.js.map