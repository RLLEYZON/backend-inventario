import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Stock } from './entities/stock.entity.js';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepository: Repository<Stock>,
  ) {}

  async findAll() {
    return await this.stockRepository.find({ relations: { product: true, warehouse: true, batch: true } });
  }

  async findByProduct(productId: string) {
    return await this.stockRepository.find({ 
      where: { productId },
      relations: { warehouse: true, batch: true }
    });
  }

  async findByWarehouse(warehouseId: string) {
    return await this.stockRepository.find({ 
      where: { warehouseId },
      relations: { product: true, batch: true }
    });
  }

  async updateStock(productId: string, warehouseId: string, quantityChange: number, batchId?: string) {
    // Build where clause: if no batchId, find the row where batchId IS NULL
    const whereClause: any = { productId, warehouseId };
    whereClause.batchId = batchId ? batchId : IsNull();

    let stock = await this.stockRepository.findOne({ where: whereClause });
    if (!stock) {
      stock = this.stockRepository.create({ 
        productId, 
        warehouseId, 
        batchId: (batchId || null) as any, 
        quantity: 0 
      });
    }
    
    stock.quantity = Number(stock.quantity) + Number(quantityChange);
    return await this.stockRepository.save(stock);
  }
}
