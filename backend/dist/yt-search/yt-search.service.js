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
exports.YtSearchService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let YtSearchService = class YtSearchService {
    http;
    constructor(http) {
        this.http = http;
    }
    async searchTurkishEducation(query) {
        const url = 'https://www.googleapis.com/youtube/v3/search';
        const params = {
            key: process.env.YT_API_KEY,
            part: 'snippet',
            type: 'video',
            maxResults: 25,
            videoEmbeddable: 'true',
            videoSyndicated: 'true',
            videoCategoryId: '27',
            relevanceLanguage: 'tr',
            regionCode: 'TR',
            safeSearch: 'moderate',
            q: query || '',
        };
        const { data } = await (0, rxjs_1.firstValueFrom)(this.http.get(url, { params }));
        return (data.items || []).map((it) => ({
            youtubeId: it.id?.videoId,
            title: it.snippet?.title,
            channelTitle: it.snippet?.channelTitle,
            publishedAt: it.snippet?.publishedAt,
            thumb: it.snippet?.thumbnails?.medium?.url || it.snippet?.thumbnails?.default?.url,
        })).filter((v) => v.youtubeId);
    }
};
exports.YtSearchService = YtSearchService;
exports.YtSearchService = YtSearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], YtSearchService);
//# sourceMappingURL=yt-search.service.js.map