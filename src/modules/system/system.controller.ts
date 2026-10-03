import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { SystemService } from './system.service.js';

@Controller('system')
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Post('reset')
  async resetSystem() {
    return this.systemService.resetSystem();
  }

  @Get('backup')
  async exportSystemData() {
    return this.systemService.exportSystemData();
  }
}
