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
exports.AdminController = void 0;
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const delete_admin_dto_1 = require("./dto/delete-admin.dto");
const update_admin_dto_1 = require("./dto/update-admin.dto");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async updateAdmin(querys, updateAdminDto, req) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        const updatedAdminData = {
            ...updateAdminDto,
            user_id: querys.user_id,
            id_role: querys.id_role,
        };
        return this.adminService.updateAdmin(updatedAdminData, ipAddress, userAgent);
    }
    async deleteAdmin(querys, req) {
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];
        return this.adminService.deleteAdmin(querys, ipAddress, userAgent);
    }
    async getAdminData() {
        return this.adminService.getAdmin();
    }
    async getAdminDataByUserId(user_id) {
        return this.adminService.getAdminDataByUserId(user_id);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Put)('edit'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_admin_dto_1.UpdateAdminDto,
        update_admin_dto_1.UpdateAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdmin", null);
__decorate([
    (0, common_1.Delete)('delete'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_admin_dto_1.DeleteAdminDto, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteAdmin", null);
__decorate([
    (0, common_1.Get)('get-all'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mengambil data admin.',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAdminData", null);
__decorate([
    (0, common_1.Get)('get'),
    (0, swagger_1.ApiOkResponse)({
        description: 'Berhasil mengambil data admin berdasarkan user id.',
    }),
    __param(0, (0, common_1.Query)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAdminDataByUserId", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map