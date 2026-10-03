import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class SystemService {
  constructor(private dataSource: DataSource) {}

  async resetSystem() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    
    // Begin transaction for safety
    await queryRunner.startTransaction();
    
    try {
      // Truncate all tables except users, using CASCADE to handle foreign keys
      await queryRunner.query('TRUNCATE TABLE "adjustments" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "movements" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "stock" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "batches" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "products" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "warehouses" CASCADE');
      await queryRunner.query('TRUNCATE TABLE "categories" CASCADE');
      
      await queryRunner.commitTransaction();
      return { message: 'El sistema ha sido reiniciado. Todos los datos (excepto usuarios) han sido eliminados.' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async exportSystemData() {
    const categories = await this.dataSource.query('SELECT * FROM "categories"');
    const warehouses = await this.dataSource.query('SELECT * FROM "warehouses"');
    const products = await this.dataSource.query('SELECT * FROM "products"');
    const batches = await this.dataSource.query('SELECT * FROM "batches"');
    const stock = await this.dataSource.query('SELECT * FROM "stock"');
    const movements = await this.dataSource.query('SELECT * FROM "movements"');
    const adjustments = await this.dataSource.query('SELECT * FROM "adjustments"');
    
    // We omit passwords or sensitive user data in the export, just ID and username if needed, or simply don't export users.
    // Assuming the user just wants the inventory data. We can include users too, just safely.
    const rawUsers = await this.dataSource.query('SELECT * FROM "users"');
    const users = rawUsers.map((u: any) => {
      const { password, ...safeUser } = u;
      return safeUser;
    });

    return {
      timestamp: new Date().toISOString(),
      data: {
        users,
        categories,
        warehouses,
        products,
        batches,
        stock,
        movements,
        adjustments,
      }
    };
  }
}
