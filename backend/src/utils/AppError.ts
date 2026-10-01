export class AppError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, statusCode = 400, errorCode = 'APP_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}
