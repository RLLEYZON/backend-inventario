import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovementsService } from './movements.service.js';
import { MovementsController } from './movements.controller.js';
import { Movement } from './entities/movement.entity.js';
import { StockModule } from '../stock/stock.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Movement]), StockModule],
  controllers: [MovementsController],
  providers: [MovementsService],
})
export class MovementsModule {}
