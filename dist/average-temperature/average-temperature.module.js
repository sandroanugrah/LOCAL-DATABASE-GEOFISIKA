"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AverageTemperatureModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const activity_log_module_1 = require("../activity-log/activity-log.module");
const average_temperature_service_1 = require("./average-temperature.service");
const average_temperature_controller_1 = require("./average-temperature.controller");
let AverageTemperatureModule = class AverageTemperatureModule {
};
exports.AverageTemperatureModule = AverageTemperatureModule;
exports.AverageTemperatureModule = AverageTemperatureModule = __decorate([
    (0, common_1.Module)({
        exports: [average_temperature_service_1.AverageTemperatureService],
        providers: [average_temperature_service_1.AverageTemperatureService],
        imports: [config_1.ConfigModule, activity_log_module_1.ActivityLogModule],
        controllers: [average_temperature_controller_1.AverageTemperatureController],
    })
], AverageTemperatureModule);
//# sourceMappingURL=average-temperature.module.js.map