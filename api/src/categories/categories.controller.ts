import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'



@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

    @Post()
    create(@Body(ValidationPipe) createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
     
    } 
  
}
