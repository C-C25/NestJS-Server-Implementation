import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersEntity } from './entities/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';

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
        const user = await this.usersRepo.findOne({
            where: { email }
        });

        if (!user) {
            throw new NotFoundException('해당 하는 이메일 사용자를 찾지 못했습니다.');
        }
    }

    async createUser(dto: CreateUserDto) {
        const { email, nickname } = dto

        const existsEmail = await this.usersRepo.exists({ where: { email } });

        if (existsEmail) {
            throw new BadRequestException('이미 사용중인 이메일 입니다.');
        };

        const existsNickanme = await this.usersRepo.exists({ where: { nickname } });

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
