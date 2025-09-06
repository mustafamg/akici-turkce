"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosController = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const videos_service_1 = require("./videos.service");
const video_dto_1 = require("./video.dto");
let VideosController = class VideosController {
    videos;
    constructor(videos) {
        this.videos = videos;
    }
    async getOne(id) {
        const v = await this.videos.findById(id);
        if (!v || v.status !== 'ok')
            throw new common_1.NotFoundException('Video not available');
        return video_dto_1.VideoDto.fromEntity(v);
    }
    async getByYoutube(youtubeId) {
        const v = await this.videos.findByYoutubeId(youtubeId);
        if (!v || v.status !== 'ok')
            throw new common_1.NotFoundException('Video not available');
        return video_dto_1.VideoDto.fromEntity(v);
    }
};
exports.VideosController = VideosController;
__decorate([
    (0, common_1.Get)(':id'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60 } }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getOne", null);
__decorate([
    (0, common_1.Get)('by-youtube/:youtubeId'),
    (0, throttler_1.Throttle)({ default: { limit: 30, ttl: 60 } }),
    __param(0, (0, common_1.Param)('youtubeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideosController.prototype, "getByYoutube", null);
exports.VideosController = VideosController = __decorate([
    (0, common_1.Controller)('videos'),
    (0, common_1.UseInterceptors)(cache_manager_1.CacheInterceptor),
    __metadata("design:paramtypes", [videos_service_1.VideosService])
], VideosController);
//# sourceMappingURL=videos.controller.js.map