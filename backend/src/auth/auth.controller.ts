import { Body, Controller, Post, Get, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User as CurrentUser } from './user.decorator';
import { JwtPayload } from './jwt-payload.interface'; // on le crée juste après

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('confirm-account')
  confirmAccount(@Query('token') token: string) {
    return this.authService.confirmAccount(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: JwtPayload) {
    return user;
  }

  @Post('forgot-password')
  forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  resetPassword(@Body('token') token: string, @Body('password') newPassword: string) {
    if (!newPassword) throw new BadRequestException('Mot de passe requis');
    return this.authService.resetPassword(token, newPassword);
  }
}
