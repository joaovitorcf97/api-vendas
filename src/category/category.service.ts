import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CreateCategory } from './dto/createCategory.dto';

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

  async findCategoryByName(name: string): Promise<CategoryEntity> {
    const category = this.categoryRepository.findOne({
      where: { name }
    });

    if (!category) {
      throw new NotFoundException(`Category ${category} not found`)
    }

    return category;
  }
  async findCategoryById(categoryId: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId }
    });

    if (!category) {
      throw new NotFoundException('Category id not found')
    }

    return category;
  }

  async createCategory(createCategory: CreateCategory): Promise<CategoryEntity> {
    const category = await this.findCategoryByName(createCategory.name)
      .catch(() => undefined);

    if (category) {
      throw new BadRequestException(`Category ${createCategory.name} exist`);
    }

    return this.categoryRepository.save(createCategory);
  }
}
