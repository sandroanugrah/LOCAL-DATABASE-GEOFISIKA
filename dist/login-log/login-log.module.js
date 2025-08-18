"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginLogModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const login_log_service_1 = require("./login-log.service");
const login_log_controller_1 = require("./login-log.controller");
let LoginLogModule = class LoginLogModule {
};
exports.LoginLogModule = LoginLogModule;
exports.LoginLogModule = LoginLogModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        exports: [login_log_service_1.LoginLogService],
        providers: [login_log_service_1.LoginLogService],
        controllers: [login_log_controller_1.LoginLogController],
    })
], LoginLogModule);
//# sourceMappingURL=login-log.module.js.map