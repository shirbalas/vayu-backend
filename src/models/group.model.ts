import { Schema, model } from 'mongoose';
import { GroupStatus } from 'src/common/enums/group-status.enum';

const GroupSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: false },
    name: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: Object.values(GroupStatus),
      default: GroupStatus.EMPTY,
      index: true,
    },
    created_at: { type: Date, default: () => new Date() },
  },
  { collection: 'groups', versionKey: false },
);

export const GroupModel = model('Group', GroupSchema);
