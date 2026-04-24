import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strateies/local.strategy';
import { LocalGuard } from './guard/local.guard/local.guard';
import { AccessTokenGuard } from './guard/jwt.guard/access.token.guard';
import { RefreshTokenGuard } from './guard/jwt.guard/refresh..token.guard';
import { AccessTokenStrategy, RefreshTokenStrategy } from './strateies/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '../users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    JwtModule.register({}),
    UsersModule,
  ],
  exports: [],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalGuard,
    AccessTokenGuard,
    RefreshTokenGuard,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule { }
