import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { PaginatedEntity } from 'src/common/entities/paginated.entity';
import { PrismaService } from 'src/platform/database/services/prisma.service';

export type Filter = {
  where?: Prisma.TodoWhereInput;
  orderBy?: Prisma.TodoOrderByWithRelationInput;
  cursor?: Prisma.TodoWhereUniqueInput;
  take?: number;
  skip?: number;
  include?: Prisma.TodoInclude;
};

@Injectable()
export class TodosRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async paginate(paginateDto: PaginationQueryDto, filter?: Filter) {
    const { limit = 10, page = 1 } = paginateDto;

    const [data, count] = await this.prismaService.$transaction([
      this.prismaService.todo.findMany({
        skip: (+page - 1) * +limit,
        take: +limit,
        where: filter?.where,
        orderBy: filter?.orderBy,
        cursor: filter?.cursor,
        include: filter?.include,
      }),
      this.prismaService.todo.count({
        where: filter?.where,
      }),
    ]);

    return new PaginatedEntity(data, {
      limit,
      page,
      totalData: count,
    });
  }

  public async create(data: Prisma.TodoCreateInput) {
    return this.prismaService.todo.create({ data });
  }

  public async update(
    where: Prisma.TodoWhereUniqueInput,
    data: Prisma.TodoUpdateInput,
  ) {
    return this.prismaService.todo.update({ where, data });
  }

  public async delete(where: Prisma.TodoWhereUniqueInput) {
    return this.prismaService.todo.update({
      where,
      data: { deletedAt: new Date() },
    });
  }

  public async first(
    where: Prisma.TodoWhereUniqueInput,
    select?: Prisma.TodoSelect,
  ) {
    return this.prismaService.todo.findUnique({ where, select });
  }

  public async firstOrThrow(
    where: Prisma.TodoWhereUniqueInput,
    select?: Prisma.TodoSelect,
  ) {
    const data = await this.prismaService.todo.findUnique({ where, select });
    if (!data) throw new Error('data.not_found');
    return data;
  }

  public async find(filter: Filter) {
    return this.prismaService.todo.findMany(filter);
  }

  public async count(filter: Omit<Filter, 'include'>) {
    return this.prismaService.todo.count(filter);
  }

  public async any(filter: Omit<Filter, 'include'>) {
    return (await this.prismaService.todo.count(filter)) > 0;
  }
}
