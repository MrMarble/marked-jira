import type { RendererExtension, Token, TokenizerAndRendererExtension, Tokens } from 'marked';
import { tokenIsCode, tokenIsLink, tokenIsList, tokenIsListItems, tokenIsTable } from './guards.ts';

export const br: RendererExtension = {
  name: 'br',
  renderer() {
    return '\n';
  },
};

export const space: RendererExtension = {
  name: 'space',
  renderer(token) {
    return token.raw;
  },
};

export const paragraph: RendererExtension = {
  name: 'paragraph',
  renderer(token) {
    return `${this.parser.parseInline(token.tokens || [])}`;
  },
};

export const heading: RendererExtension = {
  name: 'heading',
  renderer(token) {
    const newLines = token.raw.match(/\n/g)?.length || 1;
    return `h${token.depth}. ${this.parser.parseInline(token.tokens || [])}${'\n'.repeat(newLines)}`;
  },
};

export const bold: RendererExtension = {
  name: 'strong',
  renderer(token) {
    return `*${this.parser.parseInline(token.tokens || [])}*`;
  },
};

export const italic: RendererExtension = {
  name: 'em',
  renderer(token) {
    return `_${this.parser.parseInline(token.tokens || [])}_`;
  },
};

export const strikethrough: RendererExtension = {
  name: 'del',
  renderer(token) {
    return `-${this.parser.parseInline(token.tokens || [])}-`;
  },
};

export const underline: TokenizerAndRendererExtension = {
  name: 'underline',
  level: 'inline',
  start(src) {
    return src.match(/<ins>/)?.index;
  },
  tokenizer(src, tokens) {
    const rule = /^<ins>([\w\W]*?)<\/ins>/;
    const match = rule.exec(src);
    if (match) {
      const token: Token = {
        type: 'underline',
        raw: match[0],
        text: match[1].trim(),
        tokens: [],
      };
      this.lexer.inline(token.text, token.tokens);
      return token;
    }
  },
  renderer(token) {
    return `+${this.parser.parseInline(token.tokens || [])}+`;
  },
};

export const superscript: TokenizerAndRendererExtension = {
  name: 'superscript',
  level: 'inline',
  start(src) {
    return src.match(/<sup>/)?.index;
  },
  tokenizer(src, tokens) {
    const rule = /^<sup>([\w\W]*?)<\/sup>/;
    const match = rule.exec(src);
    if (match) {
      const token: Token = {
        type: 'superscript',
        raw: match[0],
        text: match[1].trim(),
        tokens: [],
      };
      this.lexer.inline(token.text, token.tokens);
      return token;
    }
  },
  renderer(token) {
    return `^${this.parser.parseInline(token.tokens || [])}^`;
  },
};

export const subscript: TokenizerAndRendererExtension = {
  name: 'subscript',
  level: 'inline',
  start(src) {
    return src.match(/<sub>/)?.index;
  },
  tokenizer(src, tokens) {
    const rule = /^<sub>([\w\W]*?)<\/sub>/;
    const match = rule.exec(src);
    if (match) {
      const token: Token = {
        type: 'subscript',
        raw: match[0],
        text: match[1].trim(),
        tokens: [],
      };
      this.lexer.inline(token.text, token.tokens);
      return token;
    }
  },
  renderer(token) {
    return `~${this.parser.parseInline(token.tokens || [])}~`;
  },
};

export const quote: TokenizerAndRendererExtension = {
  name: 'blockquote',
  level: 'block',
  renderer(token) {
    return `{quote}\n${this.parser.parse(token.tokens || [])}\n{quote}\n`;
  },
};

export const monospaced: TokenizerAndRendererExtension = {
  name: 'codespan',
  level: 'inline',
  renderer(token) {
    return `{{${token.text}}}`;
  },
};

export const link: RendererExtension = {
  name: 'link',
  renderer(token: Tokens.Link | Tokens.Generic) {
    if (!tokenIsLink(token)) return '';
    if (token?.text === token?.href) {
      return `[${token.href}]`;
    } else if (token?.text) {
      return `[${this.parser.parseInline(token.tokens || [])}|${token.href}]`;
    }
  },
};

export const list: TokenizerAndRendererExtension = {
  name: 'list',
  level: 'block',
  renderer(token: Tokens.List | Tokens.Generic) {
    if (!tokenIsList(token)) return '';
    const ordered = token.ordered;
    const type = ordered ? '#' : '*';

    let body = token.depth ? '\n' : '';
    for (let j = 0; j < token.items.length; j++) {
      const item = token.items[j];
      body += type.repeat(token.depth ?? 1) + ' ' + listItem.renderer.call(this, item) + '\n';
    }

    return body.replace(/\n+/g, '\n');
  },
};

export const listItem: RendererExtension = {
  name: 'list_item',
  renderer(token: Tokens.ListItem | Tokens.Generic) {
    if (!tokenIsListItems(token)) return '';

    const nested = token.tokens.findIndex((t) => t.type === 'list');
    if (nested !== -1 && token.tokens[nested].type === 'list') {
      if (token.tokens[nested].depth) {
        token.tokens[nested].depth += 1;
      } else {
        token.tokens[nested].depth = 2;
      }
    }

    const parsed = this.parser.parseInline(token.tokens || []);
    return parsed;
  },
};

export const code: RendererExtension = {
  name: 'code',
  renderer(token: Tokens.Code | Tokens.Generic) {
    if (!tokenIsCode(token)) return '';

    const code = token.text.trimEnd();

    if (token.lang) {
      return `{code:${token.lang}}\n${code}\n{code}\n`;
    }

    return `{noformat}\n${code}\n{noformat}\n`;
  },
};

export const table: RendererExtension = {
  name: 'table',
  renderer(token) {
    if (!tokenIsTable(token)) return '';

    const header = token.header.map((cell) => this.parser.parseInline(cell.tokens)).join(' || ');
    const rows = token.rows.map((row) => row.map((cell) => this.parser.parseInline(cell.tokens)).join(' | ')).join(' |\n');
    return `|| ${header} ||\n| ${rows} |\n`;
  },
};

export const hr: RendererExtension = {
  name: 'hr',
  renderer() {
    console.log('hr');
    return '----\n';
  },
};
