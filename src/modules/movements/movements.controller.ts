import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MovementsService } from './movements.service.js';
import { Movement } from './entities/movement.entity.js';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  create(@Body() createMovementDto: Partial<Movement>) {
    return this.movementsService.create(createMovementDto);
  }

  @Get()
  findAll() {
    return this.movementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementsService.findOne(id);
  }
}
