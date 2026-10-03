import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { AdjustmentsService } from './adjustments.service.js';
import { Adjustment, AdjustmentStatus } from './entities/adjustment.entity.js';

@Controller('adjustments')
export class AdjustmentsController {
  constructor(private readonly adjustmentsService: AdjustmentsService) {}

  @Post()
  create(@Body() createAdjustmentDto: Partial<Adjustment>) {
    return this.adjustmentsService.create(createAdjustmentDto);
  }

  @Get('fix-db')
  async fixDb() {
    await this.adjustmentsService.fixDb();
    return { success: true };
  }

  @Get()
  findAll() {
    return this.adjustmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adjustmentsService.findOne(id);
  }

  @Patch(':id/approve')
  approve(@Param('id') id: string, @Body('approvedById') approvedById: string) {
    return this.adjustmentsService.updateStatus(id, AdjustmentStatus.APPROVED, approvedById);
  }

  @Patch(':id/reject')
  reject(@Param('id') id: string, @Body('approvedById') approvedById: string) {
    return this.adjustmentsService.updateStatus(id, AdjustmentStatus.REJECTED, approvedById);
  }
}
