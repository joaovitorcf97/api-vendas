import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Roles } from 'src/decorators/roles.decorators';
import { UserType } from 'src/user/enum/userType.enem';
import { ReturnProductDTO } from './dto/returnProduct';
import { ProductEntity } from './entities/product.entity';
import { CreateProduct } from './dto/createProduct.dto';
import { DeleteResult } from 'typeorm';
import { UpdateProduct } from './dto/updateProduct.dto';
import { ReturnPriceDeliveryDTO } from './dto/returnPriceDelivery.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) { }

  @Roles(UserType.Root, UserType.Admin, UserType.User)
  @Get()
  async findAll(): Promise<ReturnProductDTO[]> {
    return (await this.productService.findAll([], true))
      .map((product) => new ReturnProductDTO(product))
  }

  @Roles(UserType.Root, UserType.Admin, UserType.User)
  @Get('/:productId')
  async findProductById(@Param('productId') productId: number): Promise<ReturnProductDTO> {
    return this.productService.findProductById(productId, true)
  }

  @Post()
  @UsePipes(ValidationPipe)
  @Roles(UserType.Root, UserType.Admin)
  async createProduct(@Body() createProduct: CreateProduct): Promise<ProductEntity> {
    return this.productService.createProduct(createProduct);
  }

  @Put('/:productId')
  @Roles(UserType.Root, UserType.Admin)
  @UsePipes(ValidationPipe)
  async updateProduct(
    @Body() updateProduct: UpdateProduct,
    @Param('productId') productId: number
  ): Promise<ProductEntity> {
    return this.productService.updateProduct(updateProduct, productId);
  }

  @Delete('/:productId')
  @Roles(UserType.Root, UserType.Admin)
  @UsePipes(ValidationPipe)
  async deleteProduct(@Param('productId') productId: number): Promise<DeleteResult> {
    return this.productService.deleteProduct(productId);
  }

  @Get('/:productId/delivery/:cep')
  async findPriceDelivery(
    @Param('productId') productId: number,
    @Param('cep') cep: string,
  ): Promise<ReturnPriceDeliveryDTO> {
    return this.productService.findPriceDelivery(cep, productId);
  }
}
