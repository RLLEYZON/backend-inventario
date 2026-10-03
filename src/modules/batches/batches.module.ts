import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchesService } from './batches.service.js';
import { BatchesController } from './batches.controller.js';
import { Batch } from './entities/batch.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Batch])],
  controllers: [BatchesController],
  providers: [BatchesService],
  exports: [BatchesService],
})
export class BatchesModule {}
