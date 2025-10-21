import { Schema, model } from 'mongoose';

const UserGroupSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    group_id: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
      index: true,
    },
  },
  { collection: 'user_groups', versionKey: false },
);

UserGroupSchema.index({ user_id: 1, group_id: 1 }, { unique: true });

export const UserGroupModel = model('UserGroup', UserGroupSchema);
