export type MyResult<T> = {
  data: T;
  success: true;
} | {
  error: MyError;
  success: false;
};

export class ResultHelper {
  static success<T>(data: T): MyResult<T> {
    return { data, success: true };
  }
  static failure<T>(error: unknown): MyResult<T> {
    return { error: MyError.fromUnknown(error), success: false };
  }
}

export class MyError extends Error {
  errors: { [field: string]: string; };

  private constructor(message: string) {
    super(message);
    this.errors = {};
  }

  static fromError(error: Error): MyError {
    return new MyError(error.message);
  }

  static fromUnknown(unknown: unknown): MyError {
    if (unknown instanceof Error) {
      return MyError.fromError(unknown);
    } else if (typeof unknown === 'string') {
      return new MyError(unknown);
    } else {
      return new MyError('Unknown error occurred');
    }
  }

  toString(): string {
    let result = this.message;

    if (this.errors) {
      result += '\n' + Object.entries(this.errors).map(([key, value]) => `${key}: ${value}`).join('\n');
    }

    return result;
  }
}