import { Injectable } from '@nestjs/common';
import { UserGroup } from '../entities/user-group.entity';

@Injectable()
export class UserGroupsRepository {
  private links = new Map<string, UserGroup>();
  private byGroup = new Map<string, number>();
  private byUser = new Map<string, string>();

  upsertMany(list: any[]) {
    this.links.clear();
    this.byGroup.clear();
    this.byUser.clear();
    for (const x of list) {
      const ug: UserGroup = {
        id: x._id ?? x.id,
        user_id: x.user_id,
        group_id: x.group_id,
      };
      if (this.byUser.has(ug.user_id)) continue;

      this.links.set(ug.id, ug);
      this.byUser.set(ug.user_id, ug.group_id);
      this.byGroup.set(ug.group_id, (this.byGroup.get(ug.group_id) ?? 0) + 1);
    }
  }

  countByGroup() {
    return this.byGroup;
  }

  remove(userId: string, groupId: string) {
    let removed = 0;

    const mapped = this.byUser.get(userId);
    if (mapped && mapped !== groupId) {
      return 0;
    }

    for (const [id, ug] of this.links) {
      if (ug.user_id === userId && ug.group_id === groupId) {
        this.links.delete(id);
        this.byUser.delete(userId);
        const prev = this.byGroup.get(groupId) ?? 0;
        this.byGroup.set(groupId, Math.max(0, prev - 1));
        removed = 1;
        break;
      }
    }
    return removed;
  }
}
