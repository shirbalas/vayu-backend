import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { UsersRepository } from '../users/repositories/users.repository';
import { GroupsRepository } from '../groups/repositories/groups.repository';
import { UserGroupsRepository } from '../user-groups/repositories/user-groups.repository';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly log = new Logger(SeederService.name);

  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly groupsRepo: GroupsRepository,
    private readonly userGroupsRepo: UserGroupsRepository,
  ) {}

  onModuleInit() {
    try {
      let p = path.join(process.cwd(), 'dist', 'src', 'seed', 'seed.json');
      if (!fs.existsSync(p)) {
        const alt = path.join(process.cwd(), 'src', 'seed', 'seed.json');
        if (fs.existsSync(alt)) p = alt;
      }
      const raw = fs.readFileSync(p, 'utf-8');
      const data = JSON.parse(raw) as {
        users?: any[];
        groups?: any[];
        user_groups?: any[];
      };
      this.usersRepo.upsertMany(data.users ?? []);
      this.groupsRepo.upsertMany(data.groups ?? []);
      this.userGroupsRepo.upsertMany(data.user_groups ?? []);

      this.log.log(`Seeded users=${(data.users??[]).length} groups=${(data.groups??[]).length} links=${(data.user_groups??[]).length}`);
    } catch (err) {
      this.log.error('Failed to seed', err as any);
    }
  }
}
