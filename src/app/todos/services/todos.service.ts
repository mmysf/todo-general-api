import { Injectable } from '@nestjs/common';
import { TodosRepository } from '../repositories';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { CreateTodosDto, UpdateTodosDto } from '../dtos';
import { Prisma, TodoStatus, User } from '@prisma/client';

@Injectable()
export class TodosService {
  constructor(private readonly todoRepository: TodosRepository) {}

  public paginate(paginateDto: PaginationQueryDto, user: User) {
    const whereCondition: Prisma.TodoWhereInput = {
      userId: user.id,
      deletedAt: null,
    };
    return this.todoRepository.paginate(paginateDto, {
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
    });
  }

  public detail(id: string) {
    try {
      return this.todoRepository.firstOrThrow({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async destroy(id: string) {
    try {
      return this.todoRepository.delete({
        id,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  public async create(createTodosDto: CreateTodosDto, user: User) {
    try {
      const data: Prisma.TodoCreateInput = {
        name: createTodosDto.name,
        status: TodoStatus.NotStarted,
      };
      Object.assign(data, {
        user: { connect: { id: user.id } },
      });
      return this.todoRepository.create(data);
    } catch (error) {
      throw new Error(error);
    }
  }

  public async update(id: string, updateTodosDto: UpdateTodosDto) {
    try {
      return this.todoRepository.update({ id }, updateTodosDto);
    } catch (error) {
      throw new Error(error);
    }
  }
}
