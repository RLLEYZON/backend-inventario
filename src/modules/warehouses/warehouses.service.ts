import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity.js';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  async create(createWarehouseDto: Partial<Warehouse>) {
    const warehouse = this.warehouseRepository.create(createWarehouseDto);
    return await this.warehouseRepository.save(warehouse);
  }

  async findAll() {
    return await this.warehouseRepository.find();
  }

  async findOne(id: string) {
    const warehouse = await this.warehouseRepository.findOne({ where: { id } });
    if (!warehouse) throw new NotFoundException(`Warehouse #${id} not found`);
    return warehouse;
  }

  async update(id: string, updateWarehouseDto: Partial<Warehouse>) {
    const warehouse = await this.findOne(id);
    this.warehouseRepository.merge(warehouse, updateWarehouseDto);
    return await this.warehouseRepository.save(warehouse);
  }

  async remove(id: string) {
    const warehouse = await this.findOne(id);
    return await this.warehouseRepository.remove(warehouse);
  }
}
