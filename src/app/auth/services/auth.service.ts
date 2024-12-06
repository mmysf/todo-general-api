import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@src/app/users/repositories';
import { hashSync } from '@node-rs/bcrypt';
import { UsersService } from 'src/app/users/services';
import { SignInDto } from '../dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import { SignUpDto } from '../dtos';
import { JwtPayload } from '../types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{
    token: string;
    user: User;
  }> {
    const user = await this.userService.signIn(signInDto);

    const payload: Partial<JwtPayload> = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });

    return {
      token,
      user,
    };
  }

  async signUp(signUpDto: SignUpDto) {
    try {
      const user = await this.userRepository.first({
        email: signUpDto.email,
      });
      if (user) throw new Error('err.email_exist');

      if (signUpDto.password !== signUpDto.confirmPassword)
        throw new Error('err.confirm_password_not_match');
      const password = hashSync(signUpDto.password, 10);

      const data: Prisma.UserCreateInput = {
        fullName: signUpDto.fullName,
        email: signUpDto.email,
        password: password,
      };
      return this.userRepository.create(data);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async profile(user: User): Promise<User> {
    return this.userService.detail(user.id);
  }
}
