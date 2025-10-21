import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/models/user.model';

function toNum(val: any, def: number) {
  const n = Number(val);
  return Number.isFinite(n) ? n : def;
}

@Injectable()
export class UsersRepository {
  async list(opts: { limit: number | string; offset: number | string }) {
    const rawLimit = toNum(opts.limit, 20);
    const rawOffset = toNum(opts.offset, 0);
    const limit = Math.max(1, Math.min(rawLimit, 100));
    const offset = Math.max(0, rawOffset);

    const [items, total] = await Promise.all([
      UserModel.find({}, { __v: 0 })
        .sort({ _id: 1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      UserModel.countDocuments({}),
    ]);

    return {
      items,
      limit,
      offset,
      page: Math.floor(offset / Math.max(limit, 1)) + 1,
    };
  }

  async bulkStatus(userIds: string[], status: string) {
    const res = await UserModel.updateMany(
      { _id: { $in: userIds } },
      { $set: { status } },
    );
    return { modified: res.modifiedCount ?? 0 };
  }
}
