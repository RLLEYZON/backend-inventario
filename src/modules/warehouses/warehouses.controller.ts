import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WarehousesService } from './warehouses.service.js';
import { Warehouse } from './entities/warehouse.entity.js';

@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  create(@Body() createWarehouseDto: Partial<Warehouse>) {
    return this.warehousesService.create(createWarehouseDto);
  }

  @Get()
  findAll() {
    return this.warehousesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehousesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWarehouseDto: Partial<Warehouse>) {
    return this.warehousesService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehousesService.remove(id);
  }
}
