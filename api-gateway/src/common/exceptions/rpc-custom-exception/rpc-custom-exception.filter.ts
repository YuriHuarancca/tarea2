 
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';
import { RpcErrorResponse } from './rpc-error-response.interface';

interface RpcErrorObject {
  status: number;
  message: unknown;
  code?: string;
  details?: unknown;
}

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcCustomExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const error = exception.getError();

    this.logger.error(error);

    const normalized = this.normalizeRpcError(error, request.url);

    response.status(normalized.status).json(normalized);
  }

  private normalizeRpcError(error: unknown, path: string): RpcErrorResponse {
    // Caso 1: string
    if (typeof error === 'string') {
      return this.buildResponse(HttpStatus.BAD_REQUEST, error, path);
    }

    // Caso 2: Error
    if (error instanceof Error) {
      return this.buildResponse(
        HttpStatus.INTERNAL_SERVER_ERROR,
        error.message,
        path,
      );
    }

    // Caso 3: Objeto personalizado
    if (this.isRpcError(error)) {
      const message = Array.isArray(error.message)
        ? error.message.join(', ')
        : String(error.message);

      return this.buildResponse(
        this.ensureValidStatus(error.status),
        message,
        path,
        error.code,
        error.details,
      );
    }

    // Caso 4: Error desconocido
    return this.buildResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error',
      path,
    );
  }

  private buildResponse(
    status: number,
    message: string,
    path: string,
    code?: string,
    details?: unknown,
  ): RpcErrorResponse {
    return {
      status,
      message,
      code,
      details,
      path,
      timestamp: new Date().toISOString(),
    };
  }

  private ensureValidStatus(status: unknown): number {
    return typeof status === 'number' && status >= 100 && status < 600
      ? status
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private isRpcError(error: unknown): error is RpcErrorObject {
    return (
      typeof error === 'object' &&
      error !== null &&
      'status' in error &&
      'message' in error
    );
  }
}
