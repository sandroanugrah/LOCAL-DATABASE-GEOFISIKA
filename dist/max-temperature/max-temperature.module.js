"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxTemperatureModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const activity_log_module_1 = require("../activity-log/activity-log.module");
const max_temperature_service_1 = require("./max-temperature.service");
const max_temperature_controller_1 = require("./max-temperature.controller");
let MaxTemperatureModule = class MaxTemperatureModule {
};
exports.MaxTemperatureModule = MaxTemperatureModule;
exports.MaxTemperatureModule = MaxTemperatureModule = __decorate([
    (0, common_1.Module)({
        exports: [max_temperature_service_1.MaxTemperatureService],
        providers: [max_temperature_service_1.MaxTemperatureService],
        controllers: [max_temperature_controller_1.MaxTemperatureController],
        imports: [config_1.ConfigModule, activity_log_module_1.ActivityLogModule],
    })
], MaxTemperatureModule);
//# sourceMappingURL=max-temperature.module.js.map