import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';
import { CreateUsersDto } from 'src/app/users/dtos';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SignUpDto extends CreateUsersDto {
  @ApiProperty()
  @IsString({
    message: i18nValidationMessage('validation.string'),
  })
  fullName: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage('validation.string'),
  })
  email: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage('validation.string'),
  })
  @IsStrongPassword(
    {},
    {
      message: i18nValidationMessage('validation.strongPassword'),
    },
  )
  password: string;

  @ApiProperty()
  @IsString({
    message: i18nValidationMessage('validation.string'),
  })
  confirmPassword: string;
}
