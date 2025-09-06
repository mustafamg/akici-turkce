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
exports.VideosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const video_entity_1 = require("./video.entity");
let VideosService = class VideosService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async onModuleInit() {
        if (process.env.SEED_ON_START !== 'true')
            return;
        const count = await this.repo.count();
        if (count > 0)
            return;
        const created = this.repo.create({
            youtubeId: 'dQw4w9WgXcQ',
            title: 'Sample Video',
            durationSec: 213,
            thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
            status: 'ok',
            hasTranscript: false,
        });
        const saved = await this.repo.save(created);
        console.log('Seeded sample video id:', saved.id);
    }
    findById(id) {
        return this.repo.findOne({ where: { id } });
    }
    findByYoutubeId(youtubeId) {
        return this.repo.findOne({ where: { youtubeId } });
    }
};
exports.VideosService = VideosService;
exports.VideosService = VideosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(video_entity_1.Video)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VideosService);
//# sourceMappingURL=videos.service.js.map