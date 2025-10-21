import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { PinoLogger } from 'nestjs-pino';
import { AppError } from '../common/errors/app-error.error';

@Injectable()
export class UsersService {
  constructor(
    private readonly repo: UsersRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UsersService.name);
  }

  async list(q: { limit: number | string; offset: number | string }) {
    try {
      const res = await this.repo.list(q);
      this.logger.info(
        { limit: res.limit, offset: res.offset, count: res.items.length },
        'users listed (limit/offset)',
      );
      return res;
    } catch (e) {
      this.logger.error({ err: e, q }, 'list users failed');
      throw AppError.internal(q);
    }
  }
}
