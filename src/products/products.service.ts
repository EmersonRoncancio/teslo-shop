import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { validate as IsUUID } from 'uuid';
import { ProductImages } from './entities/product-images.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImages)
    private readonly productImages: Repository<ProductImages>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { images = [], ...productDetails } = createProductDto;

    try {
      const newProduct = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImages.create({ url: image }),
        ),
      });
      await this.productRepository.save(newProduct);

      return newProduct;
    } catch (error) {
      this.HandleError(error);
    }
  }

  async findAll(pagination: PaginationDTO) {
    const { page = 1, limit = 5 } = pagination;

    try {
      const products = await this.productRepository.find({
        take: limit,
        skip: (page - 1) * limit,
        relations: {
          images: true,
        },
      });

      console.log(products);
      return products.map((product) => ({
        ...product,
        images: product.images.map((img) => img.url),
      }));
    } catch (error) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async findOne(term: string) {
    let products;

    if (IsUUID(term)) {
      products = await this.productRepository.findOne({
        where: { id: term },
      });
    } else {
      const buidler = this.productRepository.createQueryBuilder('prod');

      products = await buidler
        .where('UPPER(title)=:title or slug=:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!products) throw new BadRequestException('No existe el usuario');

    return products;
  }

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);

    return {
      ...rest,
      images: images.map((img) => img.url),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...restUpdate } = updateProductDto;
    const product = await this.productRepository.preload({
      id: id,
      ...restUpdate,
    });

    if (!product) throw new BadRequestException('No se encontro el producto');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImages, {
          product: { id: product.id },
        });

        product.images = images.map((img) =>
          this.productImages.create({ url: img }),
        );
      }

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      // await this.productRepository.save(product);

      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.HandleError(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);

    return product;
  }

  private HandleError(error: any) {
    this.logger.error(error);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    throw new InternalServerErrorException('Internal Server Error');
  }
}
