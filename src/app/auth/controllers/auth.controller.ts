import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { SignInDto } from '../dtos/sign-in.dto';
import { ResponseEntity } from '@src/common/entities/response.entity';
import { AuthGuard } from '../guards';
import { User } from '../decorators';
import { User as Auth } from '@prisma/client';
import { SignUpDto } from '../dtos';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Sign in',
  })
  @Post('sign-in')
  async signIn(@Body() createAuthDto: SignInDto) {
    try {
      const data = await this.authService.signIn(createAuthDto);
      return new ResponseEntity({
        status: HttpStatus.OK,
        data: data,
        message: 'Sign In Successful',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    try {
      const data = await this.authService.signUp(signUpDto);
      return new ResponseEntity({
        status: HttpStatus.CREATED,
        data: data,
        message: 'Sign Up Successful',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiSecurity('JWT')
  @UseGuards(AuthGuard)
  @Get('profile')
  async profile(@User() user: Auth) {
    try {
      const data = await this.authService.profile(user);

      return new ResponseEntity({
        message: 'success',
        data: data,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
