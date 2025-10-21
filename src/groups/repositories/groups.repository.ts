import { Injectable } from '@nestjs/common';
import { GroupModel } from 'src/models/group.model';
import { GroupStatus } from 'src/common/enums/group-status.enum';

function toNum(val: any, def: number) {
  const n = Number(val);
  return Number.isFinite(n) ? n : def;
}

type ListOpts = { limit: number | string; offset: number | string };
type ListResult = {
  items: any[];
  limit: number;
  offset: number;
  page: number;
};

@Injectable()
export class GroupsRepository {
  async list(opts: ListOpts): Promise<ListResult> {
    const rawLimit = toNum(opts.limit, 20);
    const rawOffset = toNum(opts.offset, 0);
    const limit = Math.max(1, Math.min(rawLimit, 100));
    const offset = Math.max(0, rawOffset);

    const [items, total] = await Promise.all([
      GroupModel.find({}, { __v: 0 })
        .sort({ _id: 1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      GroupModel.countDocuments({}),
    ]);

    return {
      items,
      limit,
      offset,
      page: Math.floor(offset / Math.max(limit, 1)) + 1,
    };
  }

  async setStatus(groupId: string, status: GroupStatus) {
    await GroupModel.updateOne({ _id: groupId }, { $set: { status } });
  }
}
