import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';

function toNum(val: any, def: number) {
  const n = Number(val);
  return Number.isFinite(n) ? n : def;
}

@Injectable()
export class UsersRepository {
  private usersById = new Map<string, User>();

  upsertMany(list: any[]) {
    for (const u of list) {
      const user: User = {
        id: u._id ?? u.id,
        name: u.name,
        email: u.email,
        status: u.status,
        created_at: u.created_at,
      };
      this.usersById.set(user.id, user);
    }
  }

  list(opts: { limit: number | string; offset: number | string }) {
    const rawLimit = toNum(opts.limit, 20);
    const rawOffset = toNum(opts.offset, 0);
    const limit = Math.max(1, Math.min(rawLimit, 100));
    const offset = Math.max(0, rawOffset);

    const all = [...this.usersById.values()].sort((a, b) =>
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
