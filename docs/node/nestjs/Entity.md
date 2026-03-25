# Entity 实体

实体是一个映射到数据库表的类。 你可以通过定义一个新类来创建一个实体，并用@Entity()来标记：

::: code-group

```ts [user.entity.ts]
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn() //自增列
    id: number;

    // 自动递增uuid
    // @PrimaryGeneratedColumn('uuid')
    // id: number;

    // 自动生成列;
    // @Generated('uuid')
    // uuid: string;

    @Column({ type: 'varchar', length: 25 })
    name: string;

    @Column({ type: 'int' })
    age: number;

    // 枚举列
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
}
```

```sql [user.sql]
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `age` int(0) NOT NULL,
  `gender` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '1',
  `create_time` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;
```

:::
