// errors.ts

class CustomError extends Error {
  statusCode: number;
  errorCode: string;
  timestamp: string;

  constructor(message: string, statusCode: number, errorCode: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
    Object.setPrototypeOf(this, CustomError.prototype); // Fixing prototype chain
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    Object.setPrototypeOf(this, NotFoundError.prototype); // Fixing prototype chain
  }
}

class ValidationError extends CustomError {
  constructor(message = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR');
    Object.setPrototypeOf(this, ValidationError.prototype); // Fixing prototype chain
  }
}

class InternalServerError extends CustomError {
  constructor(message = 'Internal server error') {
    super(message, 500, 'INTERNAL_SERVER_ERROR');
    Object.setPrototypeOf(this, InternalServerError.prototype); // Fixing prototype chain
  }
}

export {
  CustomError,
  NotFoundError,
  ValidationError,
  InternalServerError,
};
