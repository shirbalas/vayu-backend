import { Injectable } from '@nestjs/common';
import { UserGroupsRepository } from './repositories/user-groups.repository';
import { PinoLogger } from 'nestjs-pino';
import { AppError } from '../common/errors/app-error.error';
import { GroupsRepository } from '../groups/repositories/groups.repository';
import { GroupStatus } from 'src/common/enums/group-status.enum';
import { ErrCode } from 'src/common/errors/error-codes.error';

@Injectable()
export class UserGroupsService {
  constructor(
    private readonly repo: UserGroupsRepository,
    private readonly groupsRepo: GroupsRepository,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(UserGroupsService.name);
  }

  remove(userId: string, groupId: string) {
    try {
      const deleted = this.repo.remove(userId, groupId);
      if (!deleted) {
        throw AppError.notFound(ErrCode.NOT_FOUND, { userId, groupId });
      }

      const count = this.repo.countByGroup().get(groupId) ?? 0;
      if (count === 0) {
        this.groupsRepo.setStatus(groupId, GroupStatus.EMPTY);
        this.logger.info(
          { userId, groupId },
          'group is now empty → status updated to empty',
        );
      } else {
        this.groupsRepo.setStatus(groupId, GroupStatus.NOTEMPTY);
      }

      this.logger.info({ userId, groupId, deleted }, 'user removed from group');
      return {
        deleted,
        groupId,
        memberCount: count,
        status: count === 0 ? GroupStatus.EMPTY : GroupStatus.NOTEMPTY,
      };
    } catch (e) {
      if (e instanceof AppError) throw e;
      this.logger.error({ err: e, userId, groupId }, 'remove failed');
      throw AppError.internal({ userId, groupId });
    }
  }
}
