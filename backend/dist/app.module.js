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
const typeorm_1 = require("@nestjs/typeorm");
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
const throttler_1 = require("@nestjs/throttler");
const videos_module_1 = require("./videos/videos.module");
const video_entity_1 = require("./videos/video.entity");
const yt_search_module_1 = require("./yt-search/yt-search.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'mysql',
                    host: process.env.DB_HOST || 'localhost',
                    port: +(process.env.DB_PORT || 3306),
                    username: process.env.DB_USER || 'root',
                    password: process.env.DB_PASS || 'password',
                    database: process.env.DB_NAME || 'learner',
                    entities: [video_entity_1.Video],
                    synchronize: true,
                }),
            }),
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                useFactory: async () => ({
                    store: await (0, cache_manager_redis_yet_1.redisStore)({
                        url: process.env.REDIS_URL || 'redis://localhost:6379',
                        ttl: 60 * 60 * 24,
                    }),
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60, limit: 60 }]),
            videos_module_1.VideosModule,
            yt_search_module_1.YtSearchModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map