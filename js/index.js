marked.use(markedJira());

const editor = ace.edit('editor', {
  mode: 'ace/mode/markdown',
  selectionStyle: 'text',

});
const preview = document.getElementById('preview');
const generateButton = document.getElementById('generate');
const copyButton = document.querySelector('.copy');

function jsonString(input, level) {
  level = level || 0;
  if (Array.isArray(input)) {
    if (input.length === 0) {
      return '[]';
    }
    const items = [];
    let i;
    if (!Array.isArray(input[0]) && typeof input[0] === 'object' && input[0] !== null) {
      for (i = 0; i < input.length; i++) {
        items.push(' '.repeat(2 * level) + jsonString(input[i], level + 1));
      }
      return '[\n' + items.join('\n') + '\n]';
    }
    for (i = 0; i < input.length; i++) {
      items.push(jsonString(input[i], level));
    }
    return '[' + items.join(', ') + ']';
  } else if (typeof input === 'object' && input !== null) {
    const props = [];
    for (const prop in input) {
      props.push(prop + ':' + jsonString(input[prop], level));
    }
    return '{' + props.join(', ') + '}';
  } else {
    return JSON.stringify(input);
  }
}


editor.addEventListener('change', () => {
  const lexed = marked.lexer(editor.getValue());
  const html = marked.parser(lexed);
  const textNode = document.createTextNode(html);
  document.querySelector('#content').innerHTML = '';
  document.querySelector('#content').appendChild(textNode);
});

generateButton.addEventListener('click', () => {
  document.querySelector('button span').style.display = 'none';
  document.querySelector('.loader').style.display = 'inline-block';
  generateButton.disabled = true;
  fetch('https://brettterpstra.com/md-lipsum/api/2/3/s/decorate/link/bq/code/headers/ul/ol').then(response => response.text()).then(text => {
    editor.setValue(text);
    document.querySelector('.loader').style.display = 'none';
    document.querySelector('button span').style.display = 'inline-block';
    generateButton.disabled = false;
  });
});

copyButton.addEventListener('click', () => {
  const range = document.createRange();
  range.selectNode(document.getElementById('content'));
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand('copy');
});

editor.focus();
