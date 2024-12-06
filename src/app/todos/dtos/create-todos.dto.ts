import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTodosDto {
  @ApiProperty()
  @IsString()
  name: string;
}
