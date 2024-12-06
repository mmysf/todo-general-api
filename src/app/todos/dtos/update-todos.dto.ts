import { ApiPropertyOptional } from '@nestjs/swagger';
import { TodoStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UpdateTodosDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString({
    message: i18nValidationMessage('validation.string'),
  })
  name: string;

  @ApiPropertyOptional({
    example: 'NotStarted/Done',
  })
  @IsEnum(TodoStatus, {
    message: i18nValidationMessage('validation.todoStatus'),
  })
  status: `${TodoStatus}`;
}
