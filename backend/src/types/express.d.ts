// Augment Express Request with auth fields set by the `protect` middleware.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

export {};
