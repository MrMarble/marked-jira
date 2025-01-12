import type { Token, Tokens } from 'marked';

export function tokenIsListItems(token: Token): token is Tokens.ListItem {
  return token.type === 'list_item';
}

export function tokenIsCode(token: Token): token is Tokens.Code {
  return token.type === 'code';
}

export function tokenIsTable(token: Token): token is Tokens.Table {
  return token.type === 'table';
}
