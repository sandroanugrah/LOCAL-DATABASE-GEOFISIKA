"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const helpers_module_1 = require("../helpers/helpers.module");
const login_log_module_1 = require("../login-log/login-log.module");
const activity_log_module_1 = require("../activity-log/activity-log.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        providers: [auth_service_1.AuthService],
        controllers: [auth_controller_1.AuthController],
        imports: [config_1.ConfigModule, activity_log_module_1.ActivityLogModule, login_log_module_1.LoginLogModule, helpers_module_1.HelpersModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map