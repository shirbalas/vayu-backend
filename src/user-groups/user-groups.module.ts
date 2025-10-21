import { Module } from '@nestjs/common';
import { UserGroupsController } from './user-groups.controller';
import { UserGroupsService } from './user-groups.service';
import { UserGroupsRepository } from './repositories/user-groups.repository';
import { GroupsModule } from '../groups/groups.module';

@Module({
  imports: [GroupsModule],
  controllers: [UserGroupsController],
  providers: [UserGroupsService, UserGroupsRepository],
  exports: [UserGroupsRepository],
})
export class UserGroupsModule {}
