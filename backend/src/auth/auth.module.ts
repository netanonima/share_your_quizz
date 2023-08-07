import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalAuthGuard } from 'auth/guards/local-auth.guard';
import { UsersModule } from 'users/users.module';
import { LocalStrategy } from 'auth/strategies/local.strategy';
import { JwtStrategy } from 'auth/strategies/jwt.strategy';
import { jwtConstants } from './constants';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '720m' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthGuard, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
