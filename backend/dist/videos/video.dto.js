"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoDto = void 0;
class VideoDto {
    id;
    youtubeId;
    title;
    durationSec;
    thumbnailUrl;
    hasTranscript;
    status;
    static fromEntity(v) {
        return {
            id: v.id,
            youtubeId: v.youtubeId,
            title: v.title,
            durationSec: v.durationSec,
            thumbnailUrl: v.thumbnailUrl,
            hasTranscript: v.hasTranscript,
            status: v.status,
        };
    }
}
exports.VideoDto = VideoDto;
//# sourceMappingURL=video.dto.js.map