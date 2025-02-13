export class UserError extends Error {
  constructor(message: string, public code: number = 400) {
    super(message);
    this.name = 'UserError';
  }
}

export class AuthError extends Error {
  constructor(message: string, public code: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
} 