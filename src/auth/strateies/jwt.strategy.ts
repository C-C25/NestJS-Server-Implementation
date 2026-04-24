import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { ENV_JWT_ACCESS_SECRET_KEY, ENV_JWT_REFRESH_SECRET_KEY } from "../../common/const/env_keys_values.const";
import { payloadType } from "../const/payload";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor(
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>(ENV_JWT_ACCESS_SECRET_KEY)!,
        });
    }

    validate(payload: payloadType) {
        if (payload.type === 'access') {
            throw new UnauthorizedException('access token이 아닙니다.');
        }

        return payload;
    }
}


@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(
        private readonly configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>(ENV_JWT_REFRESH_SECRET_KEY)!,
        });
    };

    validate(payload: payloadType) {
        if (payload.type !== 'refresh') {
            throw new BadRequestException('refresh token이 아닙니다.');
        };

        return payload;
    };
}
