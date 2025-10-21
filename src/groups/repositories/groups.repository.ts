import { Injectable } from '@nestjs/common';
import { Group } from '../entities/group.entity';
import { GroupStatus } from 'src/common/enums/group-status.enum';

function toNum(val: any, def: number) {
  const n = Number(val);
  return Number.isFinite(n) ? n : def;
}

@Injectable()
export class GroupsRepository {
  private groupsById = new Map<string, Group>();

  upsertMany(list: any[]) {
    for (const g of list) {
      const group: Group = {
        id: g._id ?? g.id,
        name: g.name,
        status: g.status as GroupStatus,
        created_at: g.created_at,
      };
      this.groupsById.set(group.id, group);
    }
  }

  setStatus(groupId: string, status: GroupStatus) {
    const g = this.groupsById.get(groupId);
    if (g) {
      g.status = status;
      this.groupsById.set(groupId, g);
    }
  }

  list(opts: { limit: number | string; offset: number | string }) {
    const rawLimit = toNum(opts.limit, 20);
    const rawOffset = toNum(opts.offset, 0);
    const limit = Math.max(1, Math.min(rawLimit, 100));
    const offset = Math.max(0, rawOffset);

    const all = [...this.groupsById.values()].sort((a, b) =>
      a.id.localeCompare(b.id),
    );

    const total = all.length;
    const start = Math.max(0, Math.min(offset, total));
    const end = Math.max(start, Math.min(start + limit, total));

    const items = all.slice(start, end);
    return {
      items,
      limit,
      offset: start,
      page: Math.floor(start / Math.max(limit, 1)) + 1,
    };
  }
}
