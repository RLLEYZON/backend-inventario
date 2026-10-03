import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: Partial<Category>) {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Category #${id} not found`);
    return category;
  }

  async update(id: string, updateCategoryDto: Partial<Category>) {
    const category = await this.findOne(id);
    this.categoryRepository.merge(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    return await this.categoryRepository.remove(category);
  }
}
