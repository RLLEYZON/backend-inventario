import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Adjustment, AdjustmentStatus, AdjustmentType } from './entities/adjustment.entity.js';
import { StockService } from '../stock/stock.service.js';
import { Movement, MovementType } from '../movements/entities/movement.entity.js';

@Injectable()
export class AdjustmentsService {
  constructor(
    @InjectRepository(Adjustment)
    private adjustmentRepository: Repository<Adjustment>,
    private stockService: StockService,
    private dataSource: DataSource,
  ) {}

  async create(createAdjustmentDto: Partial<Adjustment>) {
    try {
      const adjustment = this.adjustmentRepository.create(createAdjustmentDto);
      return await this.adjustmentRepository.save(adjustment);
    } catch (e: any) {
      return { error: e.message, stack: e.stack };
    }
  }

  async fixDb() {
    await this.dataSource.query(`ALTER TABLE adjustments ALTER COLUMN requested_by_id DROP NOT NULL;`);
  }

  async findAll() {
    return await this.adjustmentRepository.find({
      relations: { product: true, warehouse: true, batch: true, requestedBy: true, approvedBy: true },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string) {
    const adj = await this.adjustmentRepository.findOne({ 
      where: { id },
      relations: { product: true, warehouse: true, batch: true, requestedBy: true, approvedBy: true }
    });
    if (!adj) throw new NotFoundException('Ajuste no encontrado');
    return adj;
  }

  async updateStatus(id: string, status: AdjustmentStatus, approvedById: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const adjustment = await this.findOne(id);
      if (adjustment.status !== AdjustmentStatus.PENDING) {
        throw new BadRequestException('El ajuste ya fue procesado');
      }

      adjustment.status = status;
      adjustment.approvedById = approvedById;
      await queryRunner.manager.save(adjustment);

      if (status === AdjustmentStatus.APPROVED) {
        // Create an implicit movement
        const movement = new Movement();
        movement.type = MovementType.ADJUSTMENT;
        movement.productId = adjustment.productId;
        movement.batchId = adjustment.batchId;
        movement.quantity = adjustment.quantity;
        movement.document = `AJUSTE-${adjustment.id}`;
        movement.userId = approvedById;
        movement.observations = adjustment.reason;

        let stockChange = 0;
        if (adjustment.type === AdjustmentType.SURPLUS) {
          stockChange = adjustment.quantity;
          movement.toWarehouseId = adjustment.warehouseId;
        } else {
          stockChange = -adjustment.quantity;
          movement.fromWarehouseId = adjustment.warehouseId;
        }

        await queryRunner.manager.save(Movement, movement);
        await this.stockService.updateStock(adjustment.productId, adjustment.warehouseId, stockChange, adjustment.batchId);
      }

      await queryRunner.commitTransaction();
      return adjustment;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
