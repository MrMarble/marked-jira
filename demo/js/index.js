marked.use(markedJira());

const $inputElement = document.getElementById('markdown');
const $outputElement = document.getElementById('jira');
const $btnGenerate = document.getElementById('generate');
const $btnCopy = document.getElementById('copy');
const $btnClear = document.getElementById('clear');


$inputElement.addEventListener('change', handleInput);
$inputElement.addEventListener('keyup', handleInput);
$inputElement.addEventListener('keypress', handleInput);
$inputElement.addEventListener('keydown', handleInput);

$btnGenerate.addEventListener('click', generate);
$btnCopy.addEventListener('click', copy);
$btnClear.addEventListener('click', clear);


function handleInput() {
  const html = marked.parse($inputElement.value);
  $outputElement.value = html;
};

function generate() {
  $btnGenerate.querySelector('span').style.display = 'none';
  $btnGenerate.querySelector('.loader').style.display = '';
  $btnGenerate.disabled = true;
  fetch('https://brettterpstra.com/md-lipsum/api/2/3/s/decorate/link/bq/code/headers/ul/ol').then(response => response.text()).then(text => {
    $inputElement.value = text;
    $inputElement.dispatchEvent(new Event('change'));
    document.querySelector('.loader').style.display = 'none';
    document.querySelector('button span').style.display = '';
    $btnGenerate.disabled = false;
  });
}

function copy() {
  $outputElement.select();
  $outputElement.setSelectionRange(0, 99999);
  navigator.clipboard.writeText($outputElement.value);
}

function clear() {
  $inputElement.value = '';
  $outputElement.value = '';
}
