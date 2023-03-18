import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseEntity } from 'src/database/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    userId: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'test@test.com' })
    @Column({ length: 50, nullable: false, default: '', comment: '유저 이메일' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '김동현' })
    @Column({ length: 20, nullable: false, default: '', comment: '유저 이름' })
    userName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '1234' })
    @Column({ type: 'text', nullable: false, select: false, comment: '유저 비밀 번호' })
    password: string;
}
