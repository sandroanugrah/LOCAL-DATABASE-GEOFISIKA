"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrothermorModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const activity_log_module_1 = require("../activity-log/activity-log.module");
const microthermor_service_1 = require("./microthermor.service");
const microthermor_controller_1 = require("./microthermor.controller");
let MicrothermorModule = class MicrothermorModule {
};
exports.MicrothermorModule = MicrothermorModule;
exports.MicrothermorModule = MicrothermorModule = __decorate([
    (0, common_1.Module)({
        exports: [microthermor_service_1.MicrothermorService],
        providers: [microthermor_service_1.MicrothermorService],
        controllers: [microthermor_controller_1.MicrothermorController],
        imports: [activity_log_module_1.ActivityLogModule, config_1.ConfigModule],
    })
], MicrothermorModule);
//# sourceMappingURL=microthermor.module.js.map