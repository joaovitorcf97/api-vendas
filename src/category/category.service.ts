import { BadRequestException, Controller, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCategory } from './dto/createCategory.dto';
import { ProductService } from 'src/product/product.service';
import { ReturnCategory } from './dto/returnCategory.dto';
import { CountProduct } from 'src/product/dto/countProduct.dto';
import { UpdateCategory } from './dto/updateCategory.dtp';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly productService: ProductService,
  ) { }

  findAmountCategoryInProducts(category: CategoryEntity, countList: CountProduct[]) {
    const count = countList.find((itemCount) => itemCount.category_id === category.id);

    if (count) {
      return count.total;
    }

    return 0;
  }

  async findAllCategories(): Promise<ReturnCategory[]> {
    const categories = await this.categoryRepository.find();

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Categories empty');
    }

    const count = await this.productService.countProductsByCategoryId();

    return categories.map((category =>
      new ReturnCategory(
        category,
        this.findAmountCategoryInProducts(category, count)
      )
    ));
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
  async findCategoryById(categoryId: number, isRelations?: boolean): Promise<CategoryEntity> {

    const relations = isRelations
      ? {
        products: true,
      }
      : undefined;

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations,
    });

    if (!category) {
      throw new NotFoundException(`Category id ${categoryId} not found`)
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

  async deleteCategory(categoryId: number): Promise<DeleteResult> {
    const category = await this.findCategoryById(categoryId, true);

    if (category.products?.length > 0) {
      throw new BadRequestException('Category with relations.');
    }

    return this.categoryRepository.delete({ id: categoryId });
  }

  async editCategory(
    categoryId: number,
    updateCategory: UpdateCategory
  ): Promise<CategoryEntity> {
    const category = await this.findCategoryById(categoryId);

    return this.categoryRepository.save({
      ...category,
      ...updateCategory
    })
  }
}
