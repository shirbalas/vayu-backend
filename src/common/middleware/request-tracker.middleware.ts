import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class RequestTrackerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestTrackerMiddleware.name);
  use(req: any, res: any, next: () => void) {
    if (req?.id) res.setHeader('x-request-id', req.id);
    this.logger.debug(
      { id: req?.id, path: req?.originalUrl },
      'request received',
    );
    next();
  }
}
