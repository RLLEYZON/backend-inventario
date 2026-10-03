import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: Partial<Product>) {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll() {
    return await this.productRepository.find({ relations: { category: true } });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id }, relations: { category: true } });
    if (!product) throw new NotFoundException(`Product #${id} not found`);
    return product;
  }

  async update(id: string, updateProductDto: Partial<Product>) {
    const product = await this.findOne(id);
    this.productRepository.merge(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return await this.productRepository.remove(product);
  }
}
