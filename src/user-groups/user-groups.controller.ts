import { Controller, Delete, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserGroupsService } from './user-groups.service';

@ApiTags('user-groups')
@Controller('user-groups')
export class UserGroupsController {
  constructor(private readonly service: UserGroupsService) {}

  @Delete()
  @ApiOkResponse({ description: 'Remove user from group (via query params)' })
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'groupId', required: true })
  remove(@Query('userId') userId: string, @Query('groupId') groupId: string) {
    return this.service.remove(userId, groupId);
  }
}
