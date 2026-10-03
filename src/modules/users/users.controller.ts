import { Controller, Get, Post, Body, Patch, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { User } from './entities/user.entity.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() body: any) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user || user.passwordHash !== body.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    return user;
  }

  @Post()
  create(@Body() createUserDto: Partial<User>) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: Partial<User>) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
