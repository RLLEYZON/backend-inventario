import { Controller, Get, Param } from '@nestjs/common';
import { StockService } from './stock.service.js';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  findAll() {
    return this.stockService.findAll();
  }

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string) {
    return this.stockService.findByProduct(productId);
  }

  @Get('warehouse/:warehouseId')
  findByWarehouse(@Param('warehouseId') warehouseId: string) {
    return this.stockService.findByWarehouse(warehouseId);
  }
}
