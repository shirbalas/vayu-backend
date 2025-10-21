import { Schema, model } from 'mongoose';
import { UserStatus } from 'src/common/enums/user-status.enum';

const UserSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: false },
    name: { type: String, required: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
      index: true,
    },
    created_at: { type: Date, default: () => new Date() },
  },
  { collection: 'users', versionKey: false },
);

export const UserModel = model('User', UserSchema);
