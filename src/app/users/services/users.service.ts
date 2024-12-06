import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateUsersDto, UpdateUsersDto } from '../dtos';
import { hashSync, verifySync } from '@node-rs/bcrypt';
import { SignInDto, SignUpDto } from 'src/app/auth/dtos';
import { Prisma } from '@prisma/client';
@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  public paginate(paginateDto: PaginationQueryDto) {
    return this.userRepository.paginate(paginateDto);
  }

  public detail(id: string) {
    try {
      return this.userRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.userRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createUsersDto: CreateUsersDto) {
    try {
      return this.userRepository.create(createUsersDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(id: string, updateUsersDto: UpdateUsersDto) {
    try {
      return this.userRepository.update({ id }, updateUsersDto);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async signUp(signUpDto: SignUpDto) {
    try {
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

  public async signIn(signInDto: SignInDto) {
    try {
      const user = await this.userRepository.first({
        email: signInDto.email,
      });
      if (!user) throw new Error('err.user_not_found');

      if (!verifySync(signInDto.password, user.password))
        throw new Error('err.wrong_password');

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
