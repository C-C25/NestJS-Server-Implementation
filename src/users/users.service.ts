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
        const user = await this.usersRepo.findOne({
            where: {
                email
            },
            select: {
                password: true,
                nickname: true,
                email: true,
            }
        });

        if (!user) {
            throw new NotFoundException('해당 하는 이메일 사용자를 찾지 못했습니다.');
        }

        return user;
    }

    async createUser(user: Pick<UsersEntity, 'email' | 'password' | 'nickname'>) {
        const existsEmail = await this.usersRepo.exists({ where: { email: user.email } });

        if (existsEmail) {
            throw new BadRequestException('이미 사용중인 이메일 입니다.');
        };

        const existsNickanme = await this.usersRepo.exists({ where: { nickname: user.nickname } });

        if (existsNickanme) {
            throw new BadRequestException('이미 사용중인 닉네임 입니다.');
        }

        const userObject = this.usersRepo.create({
            email: user.email,
            nickname: user.nickname,
            password: user.password,
        });

        const newUser = await this.usersRepo.save(userObject);

        return newUser;
    }
}

