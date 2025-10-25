export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete' | 'write';
  requestResourceData?: any;
};

export class FirestorePermissionError extends Error {
  public readonly context: SecurityRuleContext;
  public readonly serverError: any;

  constructor(context: SecurityRuleContext, serverError?: any) {
    const deniedMessage = `Firestore Security Rules denied the following request:
    {
      "auth": "See the error overlay in your browser's dev tools for auth details.",
      "operation": "${context.operation}",
      "path": "${context.path}"
    }`;

    super(deniedMessage);
    this.name = 'FirestorePermissionError';
    this.context = context;
    this.serverError = serverError;

    // This is for V8's stack trace API
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FirestorePermissionError);
    }
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }
}
