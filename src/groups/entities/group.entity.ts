import { GroupStatus } from 'src/common/enums/group-status.enum';

export interface Group {
  id: string;
  name: string;
  status: GroupStatus;
  created_at: string;
  memberCount?: number;
}
