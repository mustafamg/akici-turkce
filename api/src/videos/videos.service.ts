import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto'
import { UpdateVideoDto } from './dto/update-video.dto'
import * as videosEntity from './entities/video.entity'
import * as categoriesEntity from '../categories/entities/category.entity';
import { Difficulty } from './entities/video.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { GetVideoDto } from './dto/get-video.dto';


@Injectable()
export class VideosService {

  constructor(@InjectRepository(videosEntity.Video) private videoRepo: Repository<videosEntity.Video>,
    @InjectRepository(categoriesEntity.Category) private categoryRepo: Repository<categoriesEntity.Category>) { }


  async create(createVideoDto: CreateVideoDto) {
    const categories = await this.categoryRepo.findBy({
      id: In(createVideoDto.categoryIds),
    });

    if (!categories.length) {
      throw new NotFoundException('Categories not found');
    }

    const video = this.videoRepo.create({
      youtubeId: createVideoDto.youtubeId,
      youtubeUrl: createVideoDto.youtubeUrl,
      title: createVideoDto.title,
      description: createVideoDto.description,
      thumbnailUrl: createVideoDto.thumbnailUrl,
      transcriptUrl: createVideoDto.transcriptUrl,
      isFeatured: createVideoDto.isFeatured,
      difficulty: createVideoDto.difficulty as Difficulty,
      categories,
    });

    return this.videoRepo.save(video);

  }

  async update(id: number, updateVideoDto: UpdateVideoDto) {
    const existVideo = await this.videoRepo.findOneBy({ id })

    if (!existVideo) {
      const findVideo = { error: 'Video Not Found' }
      return findVideo

    }
    await this.videoRepo.update({ id }, {
      ...updateVideoDto,
      difficulty: updateVideoDto.difficulty as Difficulty,
    });
    const updatedVideo = await this.videoRepo.findOne({
      where: { id },
      relations: ['categories'],
    });
    return updatedVideo;

  }

  async findAll(getVideoDto: GetVideoDto) {
    const { page, limit, difficulties, categories, search, sort, order, isFeatured } = getVideoDto;

    const skip = (page - 1) * limit;

    const queryBuilder = this.videoRepo.createQueryBuilder('video')
      .leftJoinAndSelect('video.categories', 'category');

   
    if (difficulties && difficulties.length > 0) {
      queryBuilder.andWhere('video.difficulty IN (:...difficulties)', { difficulties });
    }

    if (categories && categories.length > 0) {
      queryBuilder.andWhere('category.name IN (:...categories)', { categories });
    }


    
    if (search) {
      queryBuilder.andWhere('(video.title LIKE :search OR video.description LIKE :search)', { search: `%${search}%` });
    }

  
    if (isFeatured !== undefined) {
      queryBuilder.andWhere('video.isFeatured = :isFeatured', { isFeatured });
    }

    
    queryBuilder.orderBy(`video.${sort}`, order);

   
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
    };
  }



  async findOne(id: number) {
    const findCategory = await this.videoRepo.findOneBy({ id })
    if (!findCategory) {
      throw new NotFoundException('Video not found');
    }
    return await this.videoRepo.findOne({
      where: { id },
      relations: ['categories']
    })
  }



  async remove(id: number) {
    const removeVideo = await this.videoRepo.findOneBy({ id })
    if (!removeVideo) {
      throw new NotFoundException('Video not found');
    }
    return this.videoRepo.remove(removeVideo);
  }
}


