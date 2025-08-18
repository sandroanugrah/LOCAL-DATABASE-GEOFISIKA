"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaporationModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const evaporation_service_1 = require("./evaporation.service");
const activity_log_module_1 = require("../activity-log/activity-log.module");
const evaporation_controller_1 = require("./evaporation.controller");
let EvaporationModule = class EvaporationModule {
};
exports.EvaporationModule = EvaporationModule;
exports.EvaporationModule = EvaporationModule = __decorate([
    (0, common_1.Module)({
        exports: [evaporation_service_1.EvaporationService],
        providers: [evaporation_service_1.EvaporationService],
        controllers: [evaporation_controller_1.EvaporationController],
        imports: [config_1.ConfigModule, activity_log_module_1.ActivityLogModule],
    })
], EvaporationModule);
//# sourceMappingURL=evaporation.module.js.map