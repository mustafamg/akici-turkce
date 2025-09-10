"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YtSearchModule = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const yt_search_service_1 = require("./yt-search.service");
const yt_search_controller_1 = require("./yt-search.controller");
let YtSearchModule = class YtSearchModule {
};
exports.YtSearchModule = YtSearchModule;
exports.YtSearchModule = YtSearchModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule],
        providers: [yt_search_service_1.YtSearchService],
        controllers: [yt_search_controller_1.YtSearchController],
    })
], YtSearchModule);
//# sourceMappingURL=yt-search.module.js.map