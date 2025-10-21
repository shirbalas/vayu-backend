import { Injectable } from '@nestjs/common';
import { GroupsRepository } from './repositories/groups.repository';
import { PinoLogger } from 'nestjs-pino';
import { AppError } from '../common/errors/app-error.error';

@Injectable()
export class GroupsService {
  constructor(
    private readonly repo: GroupsRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(GroupsService.name);
  }

  async list(q: { limit: number | string; offset: number | string }) {
    try {
      const res = await this.repo.list(q);
      this.logger.info(
        { limit: res.limit, offset: res.offset, count: res.items.length },
        'groups listed (limit/offset)',
      );
      return res;
    } catch (e) {
      this.logger.error({ err: e, q }, 'list groups failed');
      throw AppError.internal(q);
    }
  }
}
