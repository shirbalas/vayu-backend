export enum ErrCode {
  UNKNOWN = 'UNKNOWN',
  BAD_INPUT = 'BAD_INPUT',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  INTERNAL = 'INTERNAL',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  GROUP_NOT_FOUND = 'GROUP_NOT_FOUND',
  MEMBERSHIP_NOT_FOUND = 'MEMBERSHIP_NOT_FOUND',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export const ERROR_MESSAGES: Record<ErrCode, string> = {
  [ErrCode.USER_NOT_FOUND]: 'user not found',
  [ErrCode.VALIDATION_FAILED]: 'Validation failed',
  [ErrCode.INTERNAL_ERROR]: 'Internal Server Error',
  [ErrCode.UNKNOWN]: '',
  [ErrCode.BAD_INPUT]: '',
  [ErrCode.NOT_FOUND]: '',
  [ErrCode.CONFLICT]: '',
  [ErrCode.INTERNAL]: '',
  [ErrCode.GROUP_NOT_FOUND]: '',
  [ErrCode.MEMBERSHIP_NOT_FOUND]: '',
};
