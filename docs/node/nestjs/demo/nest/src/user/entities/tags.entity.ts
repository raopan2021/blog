import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    BeforeInsert,
    CreateDateColumn,
    Generated,
    OneToOne,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Tags {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tags: string;

    @ManyToOne(() => User, (user) => user.tags)
    @JoinColumn()
    user: User;
}
