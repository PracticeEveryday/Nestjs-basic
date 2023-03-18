import { BaseEntity } from 'src/database/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'uuid' })
    userId: string;

    @Column({ length: 50, nullable: false, default: '', comment: '유저 이메일' })
    email: string;

    @Column({ length: 20, nullable: false, default: '', comment: '유저 이름' })
    userName: string;

    @Column({ type: 'text', nullable: false, select: false, comment: '유저 비밀 번호' })
    password: string;
}
