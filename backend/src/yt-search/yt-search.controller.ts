import { Controller, Get, Query } from '@nestjs/common';
import { YtSearchService } from './yt-search.service';

@Controller('yt')
export class YtSearchController {
  constructor(private yt: YtSearchService) {}

  @Get('search-tr-edu')
  async search(@Query('q') q = '') {
    return this.yt.searchTurkishEducation(q);
  }
}
