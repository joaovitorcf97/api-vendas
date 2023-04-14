import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from 'src/user/enum/userType.enem';
import { ReturnProduct } from './dto/returnProduct';
import { ProductEntity } from './entities/product.entity';
import { CreateProduct } from './dto/createProduct.dto';
import { DeleteResult } from 'typeorm';
import { UpdateProduct } from './dto/updateProduct.dto';

@Roles(UserType.User, UserType.Admin)
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) { }

  @Get()
  async findAll(): Promise<ReturnProduct[]> {
    return (await this.productService.findAll())
      .map((product) => new ReturnProduct(product))
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createProduct(@Body() createProduct: CreateProduct): Promise<ProductEntity> {
    return this.productService.createProduct(createProduct);
  }

  @Put('/:productId')
  @UsePipes(ValidationPipe)
  async updateProduct(
    @Body() updateProduct: UpdateProduct,
    @Param('productId') productId: number
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(updateProduct, productId);
  }

  @Delete('/:productId')
  @UsePipes(ValidationPipe)
  async deleteProduct(@Param('productId') productId: number): Promise<DeleteResult> {
    return this.productService.deleteProduct(productId);
  }
}
