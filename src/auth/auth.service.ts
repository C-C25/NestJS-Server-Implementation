import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersEntity } from '../users/entities/users.entity';
import { ENV_HASH_ROUND_KEY, ENV_JWT_ACCESS_SECRET_KEY, ENV_JWT_REFRESH_SECRET_KEY } from '../common/const/env_keys_values.const';
import { LoginUserDto } from './dto/login.user.dto';
import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './dto/register.user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) { }

    private accessSing(user: Pick<UsersEntity, 'email' | 'id'>, tokenType: 'access') {
        const accessPayload = {
            sub: user.id,
            email: user.email,
            tokenType,
        };

        return this.jwtService.sign(accessPayload, {
            secret: process.env[ENV_JWT_ACCESS_SECRET_KEY],
            expiresIn: '5h',
        });
    };

    private refreshSign(user: Pick<UsersEntity, 'email' | 'id'>, tokenType: 'refresh') {
        const refreshPayload = {
            sub: user.id,
            email: user.email,
            tokenType,
        };

        return this.jwtService.sign(refreshPayload, {
            secret: process.env[ENV_JWT_REFRESH_SECRET_KEY],
            expiresIn: '7d'
        });
    };

    issuanceToken(user: Pick<UsersEntity, 'email' | 'id'>) {
        return {
            accessToken: this.accessSing(user, 'access'),
            refreshToken: this.refreshSign(user, 'refresh'),
        };
    };

    async authenticateWithEmailAndPasswod(user: Pick<UsersEntity, 'email' | 'password'>) {
        const authenticateEmail = await this.usersService.getByEmail(user.email)

        if (!authenticateEmail) {
            throw new BadRequestException('아이디 또는 비밀번호가 틀렸습니다.');
        };

        const authenticatePasswword = await bcrypt.compare(user.password, authenticateEmail.password)

        if (!authenticatePasswword) {
            throw new BadRequestException('아이디 또는 비밀번호가 틀렸습니다.');
        };

        return authenticateEmail;
    };

    async loginUser(dto: LoginUserDto) {
        const user = await this.authenticateWithEmailAndPasswod(dto);

        return this.issuanceToken(user);
    };

    async registerUser(user: Pick<UsersEntity, 'email' | 'password' | 'nickname'>) {
        const hash = await bcrypt.hash(
            user.password,
            parseInt(this.configService.get<string>(ENV_HASH_ROUND_KEY)!),
        );

        const newUser = this.usersService.createUser({
            ...user,
            password: hash,
        });

        return newUser;
    };
}