import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './stock.service.js';
import { StockController } from './stock.controller.js';
import { Stock } from './entities/stock.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  controllers: [StockController],
  providers: [StockService],
  exports: [StockService],
})
export class StockModule {}
