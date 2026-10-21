import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';

import { RpcException } from '@nestjs/microservices';
import type { Response } from 'express';

const logger = new Logger('RpcCustomExceptionFilter');

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response<unknown>>();

    const rpcError = exception.getError();
    logger.error(rpcError);
    const rpcErrorMessage =
      typeof rpcError === 'string'
        ? rpcError
        : rpcError instanceof Error
          ? rpcError.message
          : typeof rpcError === 'object' &&
              rpcError !== null &&
              'message' in rpcError &&
              typeof rpcError.message === 'string'
            ? rpcError.message
            : '';

    if (rpcErrorMessage.includes('Empty response')) {
      return response.status(500).json({
        status: 500,
        message: rpcErrorMessage.split('(')[0],
      });
    }

    if (
      typeof rpcError === 'object' &&
      rpcError !== null &&
      'status' in rpcError &&
      'message' in rpcError &&
      typeof rpcError.status === 'number' &&
      typeof rpcError.message === 'string'
    )
      return response.status(rpcError.status).json(rpcError);

    return response.status(HttpStatus.BAD_REQUEST).json(rpcError);
  }
}
