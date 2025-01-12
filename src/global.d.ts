import 'marked';

declare module 'marked' {
  namespace Tokens {
    interface List {
      depth?: number;
    }
  }
}
