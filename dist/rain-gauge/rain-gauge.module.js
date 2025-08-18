"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RainGaugeModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rain_gauge_service_1 = require("./rain-gauge.service");
const activity_log_module_1 = require("../activity-log/activity-log.module");
const rain_gauge_controller_1 = require("./rain-gauge.controller");
let RainGaugeModule = class RainGaugeModule {
};
exports.RainGaugeModule = RainGaugeModule;
exports.RainGaugeModule = RainGaugeModule = __decorate([
    (0, common_1.Module)({
        exports: [rain_gauge_service_1.RainGaugeService],
        providers: [rain_gauge_service_1.RainGaugeService],
        controllers: [rain_gauge_controller_1.RainGaugeController],
        imports: [config_1.ConfigModule, activity_log_module_1.ActivityLogModule],
    })
], RainGaugeModule);
//# sourceMappingURL=rain-gauge.module.js.map