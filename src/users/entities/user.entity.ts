import { UserStatus } from 'src/common/enums/user-status.enum';

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  created_at: string;
}
