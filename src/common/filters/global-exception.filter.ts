import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null; // With message, error and statusCode

    response.status(status).json({
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      error:
        typeof exceptionResponse === 'object'
          ? exceptionResponse
          : { message: exceptionResponse || 'Internal Server Error' },
    });
  }
}
