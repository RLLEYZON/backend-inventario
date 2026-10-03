import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdjustmentsService } from './adjustments.service.js';
import { AdjustmentsController } from './adjustments.controller.js';
import { Adjustment } from './entities/adjustment.entity.js';
import { StockModule } from '../stock/stock.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Adjustment]), StockModule],
  controllers: [AdjustmentsController],
  providers: [AdjustmentsService],
})
export class AdjustmentsModule {}
