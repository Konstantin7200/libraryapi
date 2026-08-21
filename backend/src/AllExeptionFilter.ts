import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

type ErrorReponseType = {
  status: number;
  message: string;
};
@Catch()
export class AllExeptionFilter implements ExceptionFilter {
  constructor() {
    this.logger = new Logger();
  }
  private extractMessage(response: string | Record<string, any>): string {
    if (typeof response === 'string') return response;
    if (response && typeof response === 'object' && 'message' in response) {
      return response.message as string;
    }
    return 'Unknown error';
  }

  logger: Logger;
  catch(exception: unknown, host: ArgumentsHost) {
    let error: ErrorReponseType | null = null;
    if (exception instanceof HttpException) {
      const message = this.extractMessage(exception.getResponse());

      error = {
        status: exception.getStatus(),
        message: message,
      };
    } else {
      error = {
        status: 500,
        message: 'Internal server error',
      };
    }
    if (error.status >= 500) {
      this.logger.error(
        { ...error, timestamp: new Date() },
        exception instanceof Error ? exception.stack : '',
      );
    } else {
      this.logger.warn({ ...error, timestamp: new Date() });
    }
    const http = host.switchToHttp();
    const res: Response = http.getResponse();
    res.status(error.status).json(error);
  }
}
