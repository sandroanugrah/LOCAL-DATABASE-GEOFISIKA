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
exports.ActivityLogController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const activity_log_service_1 = require("./activity-log.service");
const create_activity_log_dto_1 = require("./dto/create-activity-log.dto");
let ActivityLogController = class ActivityLogController {
    activityLogService;
    constructor(activityLogService) {
        this.activityLogService = activityLogService;
    }
    async createLog(dto) {
        return await this.activityLogService.logActivity(dto);
    }
    async getAllLog() {
        return await this.activityLogService.getAllActivityLog();
    }
    async getLogByUserId(user_id) {
        return await this.activityLogService.getActivityLogByUserId(user_id);
    }
};
exports.ActivityLogController = ActivityLogController;
__decorate([
    (0, swagger_1.ApiExcludeEndpoint)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_activity_log_dto_1.CreateActivityLogDto]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "createLog", null);
__decorate([
    (0, common_1.Get)(`/get-all`),
    (0, swagger_1.ApiOkResponse)({ description: 'Berhasil Menampilkan semua log aktivitas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getAllLog", null);
__decorate([
    (0, common_1.Get)('/get'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil Menampilkan log aktivitas berdasarkan admin_id',
    }),
    __param(0, (0, common_1.Query)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ActivityLogController.prototype, "getLogByUserId", null);
exports.ActivityLogController = ActivityLogController = __decorate([
    (0, swagger_1.ApiTags)('Activity Log'),
    (0, common_1.Controller)('activity-log'),
    __metadata("design:paramtypes", [activity_log_service_1.ActivityLogService])
], ActivityLogController);
//# sourceMappingURL=activity-log.controller.js.map