import { Injectable } from '@nestjs/common';
import { UserGroupModel } from 'src/models/userGroup.model';
import { Types } from 'mongoose';

function toObjId(maybeId: string) {
  return Types.ObjectId.isValid(maybeId) ? new Types.ObjectId(maybeId) : null;
}

@Injectable()
export class UserGroupsRepository {
  async remove(userId: string, groupId: string) {
    const uidObj = toObjId(userId);
    const gidObj = toObjId(groupId);

    const res = await UserGroupModel.collection.deleteOne({
      $or: [
        ...(uidObj && gidObj ? [{ user_id: uidObj, group_id: gidObj }] : []),
        { user_id: userId, group_id: groupId },
      ],
    } as any);

    return (res as any).deletedCount ?? 0;
  }

  async countByGroup(groupId: string) {
    const gidObj = toObjId(groupId);
    const res = await UserGroupModel.collection.countDocuments({
      $or: [...(gidObj ? [{ group_id: gidObj }] : []), { group_id: groupId }],
    } as any);
    return res;
  }
}
