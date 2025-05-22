import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorator/public.decorator';

export class LoginDto {
  email: string;
  password: string;
  role: string;
}

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(
      dto.email,
      dto.password,
      dto.role,
    );
    return this.authService.login(user);
  }
}
