import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response } from 'express';
import { LoggerService } from './logger-services';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/ban-types
  use(req: Request, res: Response, next: Function) {
    const loggerService = new LoggerService(req.url.slice(1).split('/')[0]);
    const tempUrl = req.method + ' ' + req.url.split('?')[0];
    const _headers = JSON.stringify(req.headers ? req.headers : {});
    const _query = JSON.stringify(req.query ? req.query : {});
    const _body = JSON.stringify(req.body ? req.body : {});
    const _url = JSON.stringify(tempUrl ? tempUrl : {});

    loggerService.log(
      `${_url} ${_headers} ${_query} ${_body}`.replace(/\\/, ''),
    );
    next();
  }
}
