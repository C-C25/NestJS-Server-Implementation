import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersEntity } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from '../auth/dto/register.user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepo: Repository<UsersEntity>
    ) { }

    async getUsers() {
        return this.usersRepo.find();
    }

    // auth에서 사용할 email 찾는 함수
    async getByEmail(email: string) {
        return await this.usersRepo.findOne({
            where: {
                email
            },
            select: {
                id: true,
                password: true,
                nickname: true,
                email: true,
            }
        });
    };

    async createUser(dto: RegisterUserDto) {
        const existsEmail = await this.usersRepo.exists({ where: { email: dto.email } });

        if (existsEmail) {
            throw new BadRequestException('이미 사용중인 이메일 입니다.');
        };

        const existsNickanme = await this.usersRepo.exists({ where: { nickname: dto.nickname } });

        if (existsNickanme) {
            throw new BadRequestException('이미 사용중인 닉네임 입니다.');
        }

        const userObject = this.usersRepo.create({
            email: dto.email,
            nickname: dto.nickname,
            password: dto.password,
        });

        const newUser = await this.usersRepo.save(userObject);

        return newUser;
    }
}

