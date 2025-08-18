"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpersModule = void 0;
const common_1 = require("@nestjs/common");
const time_helper_service_1 = require("./time-helper.service");
const role_helper_service_1 = require("./role-helper.service");
let HelpersModule = class HelpersModule {
};
exports.HelpersModule = HelpersModule;
exports.HelpersModule = HelpersModule = __decorate([
    (0, common_1.Module)({
        exports: [time_helper_service_1.TimeHelperService, role_helper_service_1.RoleHelperService],
        providers: [time_helper_service_1.TimeHelperService, role_helper_service_1.RoleHelperService],
    })
], HelpersModule);
//# sourceMappingURL=helpers.module.js.map