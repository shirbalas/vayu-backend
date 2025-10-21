import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

function toNum(val: unknown, def: number): number {
  if (val === null || val === undefined) return def;
  const n = Number(Array.isArray(val) ? val[0] : val);
  return Number.isFinite(n) ? n : def;
}

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get()
  @ApiOkResponse({ description: 'List users with Limit/Offset pagination' })
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: { default: 20, minimum: 1, maximum: 100 },
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    schema: { default: 0, minimum: 0 },
  })
  list(
    @Query('limit') limitQ?: string | number,
    @Query('offset') offsetQ?: string | number,
  ) {
    const limit = Math.max(1, Math.min(toNum(limitQ, 20), 100));
    const offset = Math.max(0, toNum(offsetQ, 0));

    return this.service.list({ limit, offset });
  }
}
