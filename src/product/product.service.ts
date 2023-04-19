import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult, ILike, In, Like, Repository } from 'typeorm';
import { CreateProduct } from './dto/createProduct.dto';
import { CategoryService } from '../category/category.service';
import { UpdateProduct } from './dto/updateProduct.dto';
import { CountProduct } from './dto/countProduct.dto';
import { SizeProductDTO } from 'src/correios/dto/sizeProduct.dto';
import { CorreiosService } from 'src/correios/correios.service';
import { CDServiceEnum } from 'src/correios/enums/cdService.enum';
import { ReturnPriceDeliveryDTO } from './dto/returnPriceDelivery.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @Inject(forwardRef(() => CategoryService))
    private readonly categoryService: CategoryService,

    private readonly correiosService: CorreiosService,
  ) { }

  async findAllPage(search?: string): Promise<ProductEntity[]> {
    let findOptions = {};

    if (search) {
      findOptions = {
        where: {
          name: ILike(`%${search}%`),
        }
      }
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException('Not found products')
    }

    return products;
  }

  async findAll(
    productId?: number[],
    isFindRelations?: boolean,
  ): Promise<ProductEntity[]> {
    let findOptions = {};

    if (productId && productId.length > 0) {
      findOptions = {
        where: {
          id: In(productId)
        }
      }
    }

    if (isFindRelations) {
      findOptions = {
        ...findOptions,
        relations: {
          category: true,
        }
      }
    }

    const products = await this.productRepository.find(findOptions);

    if (!products || products.length === 0) {
      throw new NotFoundException('Not found products')
    }

    return products
  }

  async createProduct(createProduct: CreateProduct): Promise<ProductEntity> {
    await this.categoryService.findCategoryById(createProduct.categoryId);

    return this.productRepository.save({
      ...createProduct,
      weight: createProduct.weight || 0,
      width: createProduct.width || 0,
      length: createProduct.length || 0,
      diameter: createProduct.diameter || 0,
      height: createProduct.height || 0,
    })
  }

  async findProductById(productId: number, isRelation?: boolean): Promise<ProductEntity> {
    const relation = isRelation ? {
      category: true,
    } : undefined;

    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: relation,
    });

    if (!product) {
      throw new NotFoundException(`Product id: ${productId} not found`);
    }

    return product;
  }

  async updateProduct(productUpdate: UpdateProduct, productId: number): Promise<ProductEntity> {
    const product = await this.findProductById(productId);

    return this.productRepository.save({
      ...product,
      ...productUpdate,
    })
  }

  async deleteProduct(productId: number): Promise<DeleteResult> {
    await this.findProductById(productId);

    return this.productRepository.delete({ id: productId });
  }

  async countProductsByCategoryId(): Promise<CountProduct[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .select('product.category_id, COUNT(*) as total')
      .groupBy('product.category_id')
      .getRawMany();
  }

  async findPriceDelivery(cep: string, idProduct: number): Promise<any> {
    const product = await this.findProductById(idProduct);

    const sizeProduct = new SizeProductDTO(product);

    const resultPrice = await Promise.all([
      this.correiosService.findPriceDelivery(CDServiceEnum.PAC, cep, sizeProduct),
      this.correiosService.findPriceDelivery(CDServiceEnum.SEDEX, cep, sizeProduct),
      this.correiosService.findPriceDelivery(CDServiceEnum.SEDEX_10, cep, sizeProduct),
    ])
      .catch(() => {
        throw new BadRequestException('Error find price delivery')
      });

    return new ReturnPriceDeliveryDTO(resultPrice);
  }
}
