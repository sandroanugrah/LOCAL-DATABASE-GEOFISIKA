"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RainfallModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rainfall_service_1 = require("./rainfall.service");
const rainfall_controller_1 = require("./rainfall.controller");
const activity_log_module_1 = require("../activity-log/activity-log.module");
let RainfallModule = class RainfallModule {
};
exports.RainfallModule = RainfallModule;
exports.RainfallModule = RainfallModule = __decorate([
    (0, common_1.Module)({
        exports: [rainfall_service_1.RainfallService],
        providers: [rainfall_service_1.RainfallService],
        controllers: [rainfall_controller_1.RainfallController],
        imports: [config_1.ConfigModule, activity_log_module_1.ActivityLogModule],
    })
], RainfallModule);
//# sourceMappingURL=rainfall.module.js.map