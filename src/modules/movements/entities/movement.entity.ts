import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity.js';
import { Warehouse } from '../../warehouses/entities/warehouse.entity.js';
import { Batch } from '../../batches/entities/batch.entity.js';
import { User } from '../../users/entities/user.entity.js';

export enum MovementType {
  IN = 'IN',
  OUT = 'OUT',
  TRANSFER = 'TRANSFER',
  RETURN_IN = 'RETURN_IN',
  RETURN_OUT = 'RETURN_OUT',
  ADJUSTMENT = 'ADJUSTMENT'
}

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: MovementType })
  type: MovementType;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'from_warehouse_id', nullable: true })
  fromWarehouseId: string;

  @ManyToOne(() => Warehouse, { nullable: true })
  @JoinColumn({ name: 'from_warehouse_id' })
  fromWarehouse: Warehouse;

  @Column({ name: 'to_warehouse_id', nullable: true })
  toWarehouseId: string;

  @ManyToOne(() => Warehouse, { nullable: true })
  @JoinColumn({ name: 'to_warehouse_id' })
  toWarehouse: Warehouse;

  @Column({ name: 'batch_id', nullable: true })
  batchId: string;

  @ManyToOne(() => Batch, { nullable: true })
  @JoinColumn({ name: 'batch_id' })
  batch: Batch;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ nullable: true })
  documentNumber: string;

  @Column({ nullable: true })
  document: string;

  @Column({ nullable: true })
  observations: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
