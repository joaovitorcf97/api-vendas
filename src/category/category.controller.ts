import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReturnCategory } from './dto/returnCategory.dto';
import { CategoryService } from './category.service';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from 'src/user/enum/userType.enem';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategory } from './dto/createCategory.dto';
import { DeleteResult } from 'typeorm';
import { UpdateCategory } from './dto/updateCategory.dtp';

@Roles(UserType.User, UserType.Root, UserType.Admin)
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService
  ) { }

  @Get()
  async findAllCategories(): Promise<ReturnCategory[]> {
    return this.categoryService.findAllCategories();
  }

  @Post()
  @Roles(UserType.Root, UserType.Admin)
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategory: CreateCategory): Promise<CategoryEntity> {
    return this.categoryService.createCategory(createCategory);
  }

  @Delete(':categoryId')
  @Roles(UserType.Root, UserType.Admin)
  async deleteCategory(@Param('categoryId') categoryId: number): Promise<DeleteResult> {
    return this.categoryService.deleteCategory(categoryId);
  }

  @Put(':categoryId')
  @Roles(UserType.Root, UserType.Admin)
  async editCategory(
    @Param('categoryId') categoryId: number,
    @Body() updateCategory: UpdateCategory,
  ): Promise<CategoryEntity> {
    return this.categoryService.editCategory(categoryId, updateCategory);
  }
}
