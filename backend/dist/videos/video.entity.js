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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Video = void 0;
const typeorm_1 = require("typeorm");
let Video = class Video {
    id;
    youtubeId;
    title;
    durationSec;
    thumbnailUrl;
    status;
    hasTranscript;
    createdAt;
    updatedAt;
};
exports.Video = Video;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Video.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)({ unique: true }),
    (0, typeorm_1.Column)({ name: 'youtube_id', type: 'varchar', length: 32 }),
    __metadata("design:type", String)
], Video.prototype, "youtubeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Video.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration_sec', type: 'int', unsigned: true, default: 0 }),
    __metadata("design:type", Number)
], Video.prototype, "durationSec", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'thumbnail_url', type: 'varchar', length: 512, nullable: true }),
    __metadata("design:type", Object)
], Video.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ type: 'enum', enum: ['ok', 'unavailable', 'private'], default: 'ok' }),
    __metadata("design:type", String)
], Video.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'has_transcript', type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Video.prototype, "hasTranscript", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Video.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Video.prototype, "updatedAt", void 0);
exports.Video = Video = __decorate([
    (0, typeorm_1.Entity)('videos')
], Video);
//# sourceMappingURL=video.entity.js.map