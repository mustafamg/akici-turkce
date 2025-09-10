import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { YtSearchService } from './yt-search.service';
import { YtSearchController } from './yt-search.controller';

@Module({
  imports: [HttpModule],
  providers: [YtSearchService],
  controllers: [YtSearchController],
})
export class YtSearchModule {}
