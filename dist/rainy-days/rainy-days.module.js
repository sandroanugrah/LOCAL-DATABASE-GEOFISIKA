"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RainyDaysModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rainy_days_service_1 = require("./rainy-days.service");
const activity_log_module_1 = require("../activity-log/activity-log.module");
const rainy_days_controller_1 = require("./rainy-days.controller");
let RainyDaysModule = class RainyDaysModule {
};
exports.RainyDaysModule = RainyDaysModule;
exports.RainyDaysModule = RainyDaysModule = __decorate([
    (0, common_1.Module)({
        exports: [rainy_days_service_1.RainyDaysService],
        providers: [rainy_days_service_1.RainyDaysService],
        controllers: [rainy_days_controller_1.RainyDaysController],
        imports: [config_1.ConfigModule, activity_log_module_1.ActivityLogModule],
    })
], RainyDaysModule);
//# sourceMappingURL=rainy-days.module.js.map