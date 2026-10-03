import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity.js';
import { Warehouse } from '../../warehouses/entities/warehouse.entity.js';
import { Batch } from '../../batches/entities/batch.entity.js';
import { User } from '../../users/entities/user.entity.js';

export enum AdjustmentType {
  SHORTAGE = 'SHORTAGE',
  SHRINKAGE = 'SHRINKAGE',
  SURPLUS = 'SURPLUS'
}

export enum AdjustmentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

@Entity('adjustments')
export class Adjustment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: AdjustmentType })
  type: AdjustmentType;

  @Column({ type: 'enum', enum: AdjustmentStatus, default: AdjustmentStatus.PENDING })
  status: AdjustmentStatus;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ name: 'batch_id', nullable: true })
  batchId: string;

  @ManyToOne(() => Batch, { nullable: true })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'text' })
  reason: string;

  @Column({ nullable: true })
  evidenceUrl: string;

  @Column({ name: 'requested_by_id', nullable: true })
  requestedById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'requested_by_id' })
  requestedBy: User;

  @Column({ name: 'approved_by_id', nullable: true })
  approvedById: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'approved_by_id' })
  approvedBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
