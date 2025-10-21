import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GroupsModule } from './groups/groups.module';
import { UserGroupsModule } from './user-groups/user-groups.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                  translateTime: 'SYS:standard',
                  ignore:
                    'pid,hostname,req.headers,req.remoteAddress,req.remotePort,res.headers',
                },
              }
            : undefined,

        genReqId(req, res) {
          const existing =
            (req.headers['x-request-id'] as string) || (req as any).id;
          const id = existing || randomUUID();
          (req as any).id = id;
          return id;
        },

        customProps(req) {
          return {
            requestId: (req as any).id,
            userAgent: req.headers['user-agent'],
          };
        },

        redact: ['req.headers.authorization'],

        autoLogging: true,
      },
    }),

    UsersModule,
    GroupsModule,
    UserGroupsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
