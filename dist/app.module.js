"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const app_controller_1 = require("./app.controller");
const admin_module_1 = require("./admin/admin.module");
const humidity_module_1 = require("./humidity/humidity.module");
const rainfall_module_1 = require("./rainfall/rainfall.module");
const login_log_module_1 = require("./login-log/login-log.module");
const lightning_module_1 = require("./lightning/lightning.module");
const rain_gauge_module_1 = require("./rain-gauge/rain-gauge.module");
const rainy_days_module_1 = require("./rainy-days/rainy-days.module");
const earthquake_module_1 = require("./earthquake/earthquake.module");
const evaporation_module_1 = require("./evaporation/evaporation.module");
const activity_log_module_1 = require("./activity-log/activity-log.module");
const air_pressure_module_1 = require("./air-pressure/air-pressure.module");
const microthermor_module_1 = require("./microthermor/microthermor.module");
const time_signature_module_1 = require("./time-signature/time-signature.module");
const rain_intensity_module_1 = require("./rain-intensity/rain-intensity.module");
const max_temperature_module_1 = require("./max-temperature/max-temperature.module");
const min_temperature_module_1 = require("./min-temperature/min-temperature.module");
const sunshine_duration_module_1 = require("./sunshine-duration/sunshine-duration.module");
const average_temperature_module_1 = require("./average-temperature/average-temperature.module");
const wind_direction_and_speed_module_1 = require("./wind-direction-and-speed/wind-direction-and-speed.module");
const moduleFeatures = [
    auth_module_1.AuthModule,
    admin_module_1.AdminModule,
    login_log_module_1.LoginLogModule,
    rainfall_module_1.RainfallModule,
    humidity_module_1.HumidityModule,
    rain_gauge_module_1.RainGaugeModule,
    rainy_days_module_1.RainyDaysModule,
    lightning_module_1.LightningModule,
    earthquake_module_1.EarthquakeModule,
    evaporation_module_1.EvaporationModule,
    activity_log_module_1.ActivityLogModule,
    air_pressure_module_1.AirPressureModule,
    microthermor_module_1.MicrothermorModule,
    rain_intensity_module_1.RainIntensityModule,
    time_signature_module_1.TimeSignatureModule,
    max_temperature_module_1.MaxTemperatureModule,
    min_temperature_module_1.MinTemperatureModule,
    sunshine_duration_module_1.SunshineDurationModule,
    average_temperature_module_1.AverageTemperatureModule,
    wind_direction_and_speed_module_1.WindDirectionAndSpeedModule,
];
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forRoot({ isGlobal: true }), ...moduleFeatures],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map