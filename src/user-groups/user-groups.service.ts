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

  async remove(userId: string, groupId: string) {
    const deleted = await this.repo.remove(userId, groupId);
    if (!deleted) {
      throw AppError.notFound(ErrCode.NOT_FOUND, { userId, groupId });
    }

    const memberCount = await this.repo.countByGroup(groupId);

    await this.groupsRepo.setStatus(
      groupId,
      memberCount === 0 ? GroupStatus.EMPTY : GroupStatus.NOTEMPTY,
    );

    this.logger.info(
      { userId, groupId, deleted, memberCount },
      'user removed from group → group status updated',
    );

    return {
      deleted,
      groupId,
      memberCount,
      status: memberCount === 0 ? GroupStatus.EMPTY : GroupStatus.NOTEMPTY,
    };
  }
}
