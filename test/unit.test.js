import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import marketJira from '../lib/index.esm.js';
import { Marked } from 'marked';

describe('market-jira', () => {
  let market;

  beforeEach(() => {
    market = new Marked(marketJira());
  });

  it('should render text', () => {
    const md = '# Heading\n\n\n\nText1\n\n---\nText2';
    const jira = market.parse(md);
    assert.strictEqual(jira, 'h1. Heading\n\n\n\nText1\n\n----\nText2');
  });

  it('should render table', () => {
    const md = '| Header1 | Header2 |\n|---------|---------|\n| Cell1   | Cell2   |';
    const jira = market.parse(md);
    assert.strictEqual(jira, '|| Header1 || Header2 ||\n| Cell1 | Cell2 |\n');
  });

  describe('Headings', () => {
    Array(6).fill(0).forEach((_, i) => {
      it(`h${i + 1}`, () => {
        const md = Array(i + 1).fill('#').join('') + ' Heading';
        const jira = market.parse(md);
        assert.strictEqual(jira, `h${i + 1}. Heading\n`);
      });
    });
  });

  describe('Text Effects', () => {
    [
      { name: 'Bold *', md: '**Bold**', jira: '*Bold*' },
      { name: 'Bold __', md: '__Bold__', jira: '*Bold*' },
      { name: 'Italic _', md: '_Italic_', jira: '_Italic_' },
      { name: 'Italic *', md: '*Italic*', jira: '_Italic_' },
      { name: 'Strikethrough', md: '~Strikethrough~', jira: '-Strikethrough-' },
      { name: 'Quote', md: '> Quote', jira: '{quote}\nQuote\n{quote}\n' },
      { name: 'Underline', md: '<ins>Underline</ins>', jira: '+Underline+' },
      { name: 'Superscript', md: '<sup>Superscript</sup>', jira: '^Superscript^' },
      { name: 'Subscript', md: '<sub>Subscript</sub>', jira: '~Subscript~' },
      { name: 'Monospace', md: '`Monospace`', jira: '{{Monospace}}' },
    ].forEach(({ name, md, jira }) => {
      it(name, () => {
        const result = market.parse(md);
        assert.strictEqual(result, jira);
      });
    });
  });

  describe('Links', () => {
    [
      { name: 'Inline with alias', md: '[Link](https://example.com)', jira: '[Link|https://example.com]' },
      { name: 'Inline without alias', md: '[https://example.com](https://example.com)', jira: '[https://example.com]' },

    ].forEach(({ name, md, jira }) => {
      it(name, () => {
        const result = market.parse(md);
        assert.strictEqual(result, jira);
      });
    });
  });

  describe('Lists', () => {
    [
      { name: 'Unordered', md: '- Item\n- Item 2', jira: '* Item\n* Item 2' },
      { name: 'Unordered *', md: '* Item\n * Item 2', jira: '* Item\n* Item 2' },
      { name: 'Ordered', md: '1. Item\n2. Item 2', jira: '# Item\n# Item 2' },
      { name: 'Nested', md: '- Item\n  - Nested\n  - Nested2\n - Item2', jira: '* Item\n** Nested\n** Nested2\n* Item2' },
    ].forEach(({ name, md, jira }) => {
      it(name, () => {
        const result = market.parse(md);
        assert.strictEqual(result, jira + '\n');
      });
    });
  });

  describe('Code', () => {
    [
      { name: 'Inline', md: '`code`', jira: '{{code}}' },
      { name: 'Block', md: '```javascript\ncode\n```', jira: '{code:javascript}\ncode\n{code}\n' },
      { name: 'Block without language', md: '```\ncode\n```', jira: '{noformat}\ncode\n{noformat}\n' },
    ].forEach(({ name, md, jira }) => {
      it(name, () => {
        const result = market.parse(md);
        assert.strictEqual(result, jira);
      });
    });
  });
});
