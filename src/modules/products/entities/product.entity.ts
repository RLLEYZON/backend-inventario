import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { Relation } from 'typeorm';
import type { Category } from '../../categories/entities/category.entity.js';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  barcode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: 'Unidad' })
  unit: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'category_id', nullable: true })
  categoryId: string;

  @ManyToOne('Category', 'products', { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Relation<Category>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
