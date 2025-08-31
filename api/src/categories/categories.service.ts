import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as videosEntity from '../videos/entities/video.entity'
import * as categoriesEntity from '../categories/entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(categoriesEntity.Category) private categoryRepo: Repository<categoriesEntity.Category>) { }

    async create(createCategoryDto: CreateCategoryDto) {

        const existingCategory = await this.categoryRepo.findOneBy({ name: createCategoryDto.name });
        if (existingCategory) {
            const categoryExist = {
                ...existingCategory,
                error: 'Category Already Exist',
            }
            return categoryExist;
        }
        const newCategory = this.categoryRepo.create(createCategoryDto);
        return this.categoryRepo.save(newCategory);
    }


    


}
