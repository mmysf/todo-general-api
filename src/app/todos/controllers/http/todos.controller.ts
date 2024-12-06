import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TodosService } from 'src/app/todos/services';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { ResponseEntity } from 'src/common/entities/response.entity';
import { CreateTodosDto, UpdateTodosDto } from 'src/app/todos/dtos';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@src/app/auth';
import { User as Auth } from '@prisma/client';
import { User } from '@src/app/auth/decorators';

@ApiTags('Todos')
@UseGuards(AuthGuard)
@ApiSecurity('JWT')
@Controller({
  path: 'todo',
  version: '1',
})
export class TodosHttpController {
  constructor(private readonly todoService: TodosService) {}

  @Post()
  public async create(
    @Body() createTodosDto: CreateTodosDto,
    @User() user: Auth,
  ) {
    try {
      const data = await this.todoService.create(createTodosDto, user);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  public async index(
    @Query() paginateDto: PaginationQueryDto,
    @User() user: Auth,
  ) {
    try {
      const data = await this.todoService.paginate(paginateDto, user);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  public async detail(@Param('id') id: string) {
    try {
      const data = await this.todoService.detail(id);

      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  public async destroy(@Param('id') id: string) {
    try {
      const data = await this.todoService.destroy(id);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateTodosDto: UpdateTodosDto,
  ) {
    try {
      const data = await this.todoService.update(id, updateTodosDto);
      return new ResponseEntity({
        data,
        message: 'success',
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
