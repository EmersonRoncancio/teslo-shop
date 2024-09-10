import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDTO } from 'src/common/dtos/pagination.dto';
import { validate as IsUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const newProduct = this.productRepository.create(createProductDto);
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
      });

      return products;
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
      const buidler = this.productRepository.createQueryBuilder();

      products = await buidler
        .where('UPPER(title)=:title or slug=:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }

    if (!products) throw new BadRequestException('No existe el usuario');

    return products;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });

    if (!product) throw new BadRequestException('No se encontro el produscto');

    try {
      await this.productRepository.save(product);

      return product;
    } catch (error) {
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
