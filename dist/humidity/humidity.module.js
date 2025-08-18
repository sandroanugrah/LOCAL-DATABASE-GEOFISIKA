"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HumidityModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const humidity_service_1 = require("./humidity.service");
const humidity_controller_1 = require("./humidity.controller");
const activity_log_module_1 = require("../activity-log/activity-log.module");
let HumidityModule = class HumidityModule {
};
exports.HumidityModule = HumidityModule;
exports.HumidityModule = HumidityModule = __decorate([
    (0, common_1.Module)({
        exports: [humidity_service_1.HumidityService],
        providers: [humidity_service_1.HumidityService],
        controllers: [humidity_controller_1.HumidityController],
        imports: [config_1.ConfigModule, activity_log_module_1.ActivityLogModule],
    })
], HumidityModule);
//# sourceMappingURL=humidity.module.js.map