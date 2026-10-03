import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Batch } from './entities/batch.entity.js';

@Injectable()
export class BatchesService {
  constructor(
    @InjectRepository(Batch)
    private batchRepository: Repository<Batch>,
  ) {}

  async create(createBatchDto: Partial<Batch>) {
    const batch = this.batchRepository.create(createBatchDto);
    return await this.batchRepository.save(batch);
  }

  async findAll() {
    return await this.batchRepository.find({ relations: { product: true } });
  }

  async findOne(id: string) {
    const batch = await this.batchRepository.findOne({ where: { id }, relations: { product: true } });
    if (!batch) throw new NotFoundException(`Batch #${id} not found`);
    return batch;
  }

  async update(id: string, updateBatchDto: Partial<Batch>) {
    const batch = await this.findOne(id);
    this.batchRepository.merge(batch, updateBatchDto);
    return await this.batchRepository.save(batch);
  }

  async remove(id: string) {
    const batch = await this.findOne(id);
    return await this.batchRepository.remove(batch);
  }
}
