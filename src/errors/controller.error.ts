import { logger } from '@work-whiz/utils';
import {
  IControllerErrorResponse,
  IControllerErrorOptions,
  IServiceErrorDetails,
} from '@work-whiz/interfaces';
import { ServiceError } from './service.error';

export class ControllerError extends Error {
  public readonly statusCode: number;
  public readonly serviceName: string;
  private readonly logData?: Record<string, unknown> | IServiceErrorDetails;

  constructor(
    statusCode: number,
    message: string,
    options: IControllerErrorOptions
  ) {
    super(message);
    this.name = 'ControllerError';
    this.statusCode = statusCode;
    this.serviceName = options.serviceName;
    this.logData = options.logData;

    this.logError();

    Object.setPrototypeOf(this, ControllerError.prototype);
  }

  private logError() {
    const logPayload = {
      statusCode: this.statusCode,
      message: this.message,
      serviceName: this.serviceName,
      errorName: this.name,
      stack: this.stack,
      ...(this.logData && { details: this.logData }),
    };

    if (this.statusCode >= 500) {
      logger.error(logPayload);
    } else {
      logger.warn(logPayload);
    }
  }

  public toResponse(): IControllerErrorResponse {
    return {
      statusCode: this.statusCode,
      error: {
        message: this.message,
        serviceName: this.serviceName,
      },
    };
  }

  public static fromServiceError(
    serviceError: IServiceErrorDetails | ServiceError,
    options: IControllerErrorOptions
  ): ControllerError {
    const message =
      typeof serviceError === 'string' ? serviceError : serviceError.message;

    return new ControllerError(
      serviceError instanceof ServiceError ? serviceError.statusCode : 500,
      message,
      {
        ...options,
        logData: serviceError,
      }
    );
  }
}
