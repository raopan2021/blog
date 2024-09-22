import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Device {
    @PrimaryGeneratedColumn() //自增列
    id: number;

    // model: 'AMD Ryzen 7 PRO 5850U with Radeon Graphics     ',
    // speed: 1896,
    // times: { user: 573484, nice: 0, sys: 536312, idle: 87725421, irq: 2796 }

    @Column({ type: 'varchar' })
    model: string;

    @Column({ type: 'longtext' })
    cpu: string;

    @Column({ type: 'int' })
    uptime: number;

    @Column({ type: 'bigint' })
    totalmem: number;

    @Column({ type: 'bigint' })
    freemem: number;

    @CreateDateColumn({ type: 'timestamp' })
    create_time: Date;
}
