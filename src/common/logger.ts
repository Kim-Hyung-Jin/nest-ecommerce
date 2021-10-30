import { Logger } from '@nestjs/common';

export function logger(message: string, obj: object) {
  Logger.log(message + JSON.stringify(obj, null, 2));
}
