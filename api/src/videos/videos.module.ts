import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { Category } from '../categories/entities/category.entity';
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports:[TypeOrmModule.forFeature([Video,Category]),
 CategoriesModule],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
