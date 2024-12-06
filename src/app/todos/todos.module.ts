import { Module } from '@nestjs/common';
import { TodosHttpController } from './controllers';
import { TodosService } from './services';
import { TodosRepository } from './repositories';

@Module({
  controllers: [TodosHttpController],
  providers: [TodosService, TodosRepository],
})
export class TodosModule {}
