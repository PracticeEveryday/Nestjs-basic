import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'src/database/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../interfaces/user.interface';

@Entity('users')
export class UserEntity extends BaseEntity implements User {
    @PrimaryGeneratedColumn()
    userId: number;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'test@test.com', required: true })
    @Column({ length: 50, nullable: false, default: '', comment: '유저 이메일', unique: true })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '김동현', required: true })
    @Column({ length: 20, nullable: false, default: '', comment: '유저 이름' })
    userName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '1234', required: true })
    @Column({ type: 'text', nullable: false, comment: '유저 비밀 번호' })
    password: string;
}
