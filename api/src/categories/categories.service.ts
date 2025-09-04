// src/categories/categories.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Capitalize first letter and lowercase the rest
    createCategoryDto.name =
      createCategoryDto.name.charAt(0).toUpperCase() +
      createCategoryDto.name.slice(1).toLowerCase();

    const ifExists = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    if (ifExists) {
      throw new BadRequestException('Category already exists');
    }
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ relations: ['videos'] });
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['videos'],
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    if (updateCategoryDto.name) {
      updateCategoryDto.name =
        updateCategoryDto.name.charAt(0).toUpperCase() +
        updateCategoryDto.name.slice(1).toLowerCase();

      const ifExists = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });
      if (ifExists && ifExists.id !== id) {
        throw new BadRequestException('Category already exists');
      }
    }
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    return this.categoryRepository.remove(category);
  }

  async checkNameExists(name: string): Promise<{ exists: boolean }> {
    const category = await this.categoryRepository.findOne({
      where: { name },
    });
    return { exists: !!category };
  }

  async getNames(): Promise<string[]> {
    const categories = await this.categoryRepository.find({
      select: ['name'],
    });
    return categories.map((category) => category.name);
  }
}
