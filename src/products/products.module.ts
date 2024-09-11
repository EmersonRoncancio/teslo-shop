import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImages } from './entities/product-images.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [ConfigModule, TypeOrmModule.forFeature([Product, ProductImages])],
})
export class ProductsModule {}
