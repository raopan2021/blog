import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Tags } from './tags.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn() //自增列
    id: number;

    @Column({ type: 'varchar', length: 25 })
    name: string;

    @Column({ type: 'int' })
    age: number;

    @Column({
        type: 'enum',
        enum: ['0', '1'],
        default: '1',
    })
    gender: string;

    @CreateDateColumn({ type: 'timestamp' })
    create_time: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updateTime: Date;

    @OneToMany(() => Tags, (tags) => tags.user)
    tags: Tags[];
}
