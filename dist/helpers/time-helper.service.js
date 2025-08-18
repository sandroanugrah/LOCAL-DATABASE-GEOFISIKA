"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeHelperService = void 0;
const common_1 = require("@nestjs/common");
const date_fns_tz_1 = require("date-fns-tz");
let TimeHelperService = class TimeHelperService {
    formatCreatedAt(date, timeZone) {
        const zonedDate = (0, date_fns_tz_1.toZonedTime)(date, timeZone);
        return (0, date_fns_tz_1.format)(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", {
            timeZone: 'UTC',
        });
    }
};
exports.TimeHelperService = TimeHelperService;
exports.TimeHelperService = TimeHelperService = __decorate([
    (0, common_1.Injectable)()
], TimeHelperService);
//# sourceMappingURL=time-helper.service.js.map