// src/entities/Borrows.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Book } from './Book';
import { Borrower } from './Borrower';

@Entity()
export class Borrows {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Book)
    @JoinColumn({ name: 'isbn', referencedColumnName: 'isbn' })
    book!: Book;

    @ManyToOne(() => Borrower)
    @JoinColumn({ name: 'borrower_id' })
    borrower!: Borrower;

    @Column({ nullable: false })
    @Index()
    checkout_date!: Date;

    @Column({ nullable: false })
    @Index()
    due_date!: Date;

    @Column({ default: false })
    returned!: boolean;
}
