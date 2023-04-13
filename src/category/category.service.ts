import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>
  ) { }

  async findAllCategories(): Promise<CategoryEntity[]> {
    const categories = this.categoryRepository.find();

    if (!categories || (await categories).length === 0) {
      throw new NotFoundException('Categories empty');
    }

    return categories;
  }
}
