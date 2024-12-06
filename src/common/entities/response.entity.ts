import { HttpStatus } from '@nestjs/common';
import { isArray } from 'class-validator';
import { I18nContext } from 'nestjs-i18n';

export class ResponseEntity<T = unknown> {
  data?: T | null;
  message?: string;
  status?: HttpStatus;
  errors?: { field: string; message: string[] }[];

  constructor({
    message,
    data,
    status,
    errors,
  }: {
    message?: string;
    data?: T;
    status?: HttpStatus;
    errors?: { field: string; message: string[] }[];
  }) {
    this.message =
      I18nContext.current()?.i18n?.t(
        isArray(message) ? message[0] : message || '',
        {
          args: isArray(message) ? message[1] : {},
          lang: I18nContext.current()?.lang,
        },
      ) || 'success';
    this.data = data || null;
    this.status = status;
    this.errors = errors;
  }
}
