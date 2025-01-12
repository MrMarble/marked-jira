# marked-jira
A custom renderer for [marked](https://marked.js.org) that generates Jira-compatible markup.

Currently, it supports the following features:
- Headings
- Blockquotes
- Lists
- Code blocks
- Tables
- Links
- Text formatting (bold, italic, underline, strikethrough)
- Horizontal rules


## Demo
Check out the [demo](https://marked-jira.mrmarble.dev) to see it in action. 👀


## Usage
```javascript
import { marked } from "marked";
import markedJira from "marked-jira";

// or UMD script
// <script src="https://unpkg.com/marked/marked.min.js"></script>
// <script src="https://unpkg.com/marked-jira/marked-jira.min.js"></script>

marked.use(markedJira(options));

marked.parse("# Hello, world!");
// h1. Hello, world!
```

---

### References
- [Jira Wiki Renderer](https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=all)
- [GitHub Flavored Markdown Spec](https://docs.github.com/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax)
- [Markdown link formats](https://gist.github.com/emedinaa/28ed71b450243aba48accd634679f805)
