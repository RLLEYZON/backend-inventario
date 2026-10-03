import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Movement, MovementType } from './entities/movement.entity.js';
import { StockService } from '../stock/stock.service.js';

@Injectable()
export class MovementsService {
  constructor(
    @InjectRepository(Movement)
    private movementRepository: Repository<Movement>,
    private stockService: StockService,
    private dataSource: DataSource,
  ) {}

  async create(createMovementDto: Partial<Movement>) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const movement = this.movementRepository.create(createMovementDto);
      const savedMovement = await queryRunner.manager.save(movement);

      // Stock logic
      if (movement.type === MovementType.IN || movement.type === MovementType.RETURN_IN) {
        if (!movement.toWarehouseId) throw new BadRequestException('Destino es requerido');
        await this.stockService.updateStock(movement.productId, movement.toWarehouseId, movement.quantity, movement.batchId);
      } 
      else if (movement.type === MovementType.OUT || movement.type === MovementType.RETURN_OUT) {
        if (!movement.fromWarehouseId) throw new BadRequestException('Origen es requerido');
        await this.stockService.updateStock(movement.productId, movement.fromWarehouseId, -movement.quantity, movement.batchId);
      }
      else if (movement.type === MovementType.TRANSFER) {
        if (!movement.fromWarehouseId || !movement.toWarehouseId) throw new BadRequestException('Origen y Destino requeridos');
        await this.stockService.updateStock(movement.productId, movement.fromWarehouseId, -movement.quantity, movement.batchId);
        await this.stockService.updateStock(movement.productId, movement.toWarehouseId, movement.quantity, movement.batchId);
      }

      await queryRunner.commitTransaction();
      return savedMovement;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.movementRepository.find({
      relations: { product: true, fromWarehouse: true, toWarehouse: true, user: true, batch: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string) {
    return await this.movementRepository.findOne({ 
      where: { id },
      relations: { product: true, fromWarehouse: true, toWarehouse: true, user: true, batch: true }
    });
  }
}
