import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { User } from './modules/users/entities/user.entity.js';
import { Category } from './modules/categories/entities/category.entity.js';
import { Warehouse } from './modules/warehouses/entities/warehouse.entity.js';
import { Product } from './modules/products/entities/product.entity.js';
import { Batch } from './modules/batches/entities/batch.entity.js';
import { Stock } from './modules/stock/entities/stock.entity.js';
import { Movement } from './modules/movements/entities/movement.entity.js';
import { Adjustment } from './modules/adjustments/entities/adjustment.entity.js';

import { UsersModule } from './modules/users/users.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { WarehousesModule } from './modules/warehouses/warehouses.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { BatchesModule } from './modules/batches/batches.module.js';
import { StockModule } from './modules/stock/stock.module.js';
import { MovementsModule } from './modules/movements/movements.module.js';
import { AdjustmentsModule } from './modules/adjustments/adjustments.module.js';
import { SystemModule } from './modules/system/system.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_DATABASE', 'inventario_db'),
        entities: [User, Category, Warehouse, Product, Batch, Stock, Movement, Adjustment],
        synchronize: true, // Auto-create tables (use migrations in production)
      }),
    }),
    UsersModule,
    CategoriesModule,
    WarehousesModule,
    ProductsModule,
    BatchesModule,
    StockModule,
    MovementsModule,
    AdjustmentsModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
