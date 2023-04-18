import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReturnCategory } from './dto/returnCategory.dto';
import { CategoryService } from './category.service';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from 'src/user/enum/userType.enem';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategory } from './dto/createCategory.dto';

@Roles(UserType.User, UserType.Admin)
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
  @Roles(UserType.Admin)
  @UsePipes(ValidationPipe)
  async createCategory(@Body() createCategory: CreateCategory): Promise<CategoryEntity> {
    return this.categoryService.createCategory(createCategory);
  }
}
