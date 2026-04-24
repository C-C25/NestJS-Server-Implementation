import { Injectable, UnauthorizedException } from '@nestjs/common';
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

    accessVerifyToken(tokenType: string) {
        try {
            return this.jwtService.verify(tokenType, {
                secret: this.configService.get<string>(ENV_JWT_ACCESS_SECRET_KEY),
            });
        } catch (e) {
            throw new UnauthorizedException('access token이 만료 되었습니다.');
        };
    };

    refreshVerifyToken(tokenType: string) {
        try {
            return this.jwtService.verify(tokenType, {
                secret: this.configService.get<string>(ENV_JWT_REFRESH_SECRET_KEY),
            })
        } catch (e) {
            throw new UnauthorizedException('refresh token이 만료 되었습니다.');
        };
    };

    /**
     * refresh 로 refresh 로 발급 가능 경우
     */
    reissuanceOfRefreshToken(refreshToken: string) {
        const decoded = this.refreshVerifyToken(refreshToken);

        if (decoded.tokenType !== 'refresh') {
            throw new UnauthorizedException('토큰 재발급은 refresh 토큰으로만 가능합니다.')
        }

        return this.accessSign({
            id: decoded.sub,
            email: decoded.email
        }, 'access')
    }

    private accessSign(user: Pick<UsersEntity, 'email' | 'id'>, tokenType: 'access') {
        const accessPayload = {
            sub: user.id,
            email: user.email,
            tokenType,
        };

        return this.jwtService.sign(accessPayload, {
            secret: this.configService.get<string>(ENV_JWT_ACCESS_SECRET_KEY),
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
            secret: this.configService.get<string>(ENV_JWT_REFRESH_SECRET_KEY),
            expiresIn: '7d'
        });
    };

    issuanceToken(user: Pick<UsersEntity, 'email' | 'id'>) {
        return {
            accessToken: this.accessSign(user, 'access'),
            refreshToken: this.refreshSign(user, 'refresh'),
        };
    };

    async authenticateWithEmailAndPassword(user: Pick<UsersEntity, 'email' | 'password'>) {
        const authenticateEmail = await this.usersService.getByEmail(user.email)

        if (!authenticateEmail) {
            throw new UnauthorizedException('아이디 또는 비밀번호가 틀렸습니다.');
        };

        const authenticatePassword = await bcrypt.compare(user.password, authenticateEmail.password)

        if (!authenticatePassword) {
            throw new UnauthorizedException('아이디 또는 비밀번호가 틀렸습니다.');
        };

        return authenticateEmail;
    };

    async loginUser(dto: LoginUserDto) {
        const user = await this.authenticateWithEmailAndPassword(dto);

        return this.issuanceToken(user);
    };

    // 회원 가입 
    async registerUser(dto: RegisterUserDto) {
        const hash = await bcrypt.hash(
            dto.password,
            parseInt(this.configService.get<string>(ENV_HASH_ROUND_KEY)!),
        );

        const newUser = await this.usersService.createUser({
            ...dto,
            password: hash,
        });

        return newUser;
    };
};