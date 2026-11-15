// renderMarkdown() must keep Markdown's normal formatting and strip anything
// that could run script. DOMPurify needs a DOM, so these tests provide one
// with jsdom (the browser provides the real one in production).
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

let renderMarkdown;
let dom;

before(async () => {
  dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost:8080/' });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  ({ renderMarkdown } = await import('../src/utils/markdown.js'));
});

function parse(html) {
  const doc = new dom.window.DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  return doc.body;
}

function assertNoActiveContent(html) {
  const body = parse(html);
  for (const el of body.querySelectorAll('*')) {
    for (const attr of el.attributes) {
      assert.ok(!/^on/i.test(attr.name), `event handler attribute survived: ${attr.name}`);
      assert.ok(!['style', 'srcdoc', 'formaction', 'xlink:href'].includes(attr.name.toLowerCase()), `dangerous attribute survived: ${attr.name}`);
      if (['href', 'src', 'action'].includes(attr.name)) {
        assert.ok(!/^\s*(javascript|vbscript|data:text)/i.test(attr.value), `dangerous URL survived: ${attr.value}`);
      }
    }
  }
  for (const tag of ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'style', 'link', 'meta', 'base', 'svg', 'math', 'template', 'frame', 'frameset']) {
    assert.equal(body.querySelector(tag), null, `<${tag}> survived`);
  }
}

test('keeps legitimate Markdown formatting', () => {
  const md = [
    '# Heading 1',
    '## Heading 2',
    '',
    'A paragraph with **bold**, *italic*, ~~strike~~ and `code`.',
    '',
    '- item one',
    '- item two',
    '',
    '1. first',
    '2. second',
    '',
    '> a quote',
    '',
    '[Wolfpack](https://wolfpack.example/stories/x "Title") and [relative](/artists/echo) and [mail](mailto:hi@example.com)',
    '',
    '![Cover](https://images.example/cover.jpg)',
    '',
    '| a | b |',
    '|---|---|',
    '| 1 | 2 |',
    '',
    '```',
    'const x = "<script>not executed</script>";',
    '```',
  ].join('\n');

  const body = parse(renderMarkdown(md));
  assert.equal(body.querySelector('h1').textContent, 'Heading 1');
  assert.equal(body.querySelector('h2').textContent, 'Heading 2');
  assert.equal(body.querySelector('strong').textContent, 'bold');
  assert.equal(body.querySelector('em').textContent, 'italic');
  assert.ok(body.querySelector('del'));
  assert.equal(body.querySelectorAll('ul > li').length, 2);
  assert.equal(body.querySelectorAll('ol > li').length, 2);
  assert.ok(body.querySelector('blockquote'));
  assert.ok(body.querySelector('table td'));

  const links = [...body.querySelectorAll('a')];
  assert.deepEqual(links.map((a) => a.getAttribute('href')), ['https://wolfpack.example/stories/x', '/artists/echo', 'mailto:hi@example.com']);
  assert.equal(links[0].getAttribute('title'), 'Title');
  assert.ok(links.every((a) => a.getAttribute('rel') === 'noopener noreferrer'));

  const img = body.querySelector('img');
  assert.equal(img.getAttribute('src'), 'https://images.example/cover.jpg');
  assert.equal(img.getAttribute('alt'), 'Cover');

  // Code blocks keep their text (escaped), not executable markup.
  assert.match(body.querySelector('pre code').textContent, /<script>not executed<\/script>/);
  assertNoActiveContent(body.innerHTML);
});

test('strips script tags and inline event handlers', () => {
  const payloads = [
    '<script>alert(1)</script>',
    '<img src="x" onerror="alert(1)">',
    '<svg onload="alert(1)"><circle/></svg>',
    '<a href="https://ok.example" onclick="alert(1)">x</a>',
    '<p onmouseover="alert(1)" style="background:url(javascript:alert(1))">hover</p>',
    '<details open ontoggle="alert(1)">x</details>',
    '<body onload="alert(1)">',
    '<iframe src="https://evil.example"></iframe>',
    '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
    '<object data="javascript:alert(1)"></object>',
    '<embed src="javascript:alert(1)">',
    '<form action="javascript:alert(1)"><button>go</button></form>',
    '<style>body{display:none}</style>',
    '<link rel="stylesheet" href="https://evil.example/x.css">',
    '<meta http-equiv="refresh" content="0;url=javascript:alert(1)">',
    '<base href="https://evil.example/">',
    '<math><mtext><table><mglyph><style><img src=x onerror=alert(1)></style></mglyph></table></mtext></math>',
    '<noscript><p title="</noscript><img src=x onerror=alert(1)>"></noscript>',
    '<template><img src=x onerror=alert(1)></template>',
    '"><img src=x onerror=alert(1)>',
  ];
  for (const p of payloads) {
    const html = renderMarkdown(`Intro text\n\n${p}\n\nOutro text`);
    assertNoActiveContent(html);
    assert.match(html, /Intro text/);
    assert.match(html, /Outro text/);
  }
});

test('removes javascript:, vbscript: and data: URLs from links and images', () => {
  const md = [
    '[click](javascript:alert(1))',
    '[click2](JaVaScRiPt:alert(1))',
    '[click3](  javascript:alert(1))',
    '<a href="jav&#x09;ascript:alert(1)">tab</a>',
    '<a href="&#106;avascript:alert(1)">entity</a>',
    '[vb](vbscript:msgbox(1))',
    '[data](data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==)',
    '![img](javascript:alert(1))',
    '<a href="file:///etc/passwd">file</a>',
  ].join('\n\n');
  const body = parse(renderMarkdown(md));
  for (const el of body.querySelectorAll('[href], [src]')) {
    const v = el.getAttribute('href') ?? el.getAttribute('src');
    assert.doesNotMatch(v, /^\s*(javascript|vbscript|data|file):/i, `unsafe URL kept: ${v}`);
  }
  assertNoActiveContent(body.innerHTML);
});

test('non-string / empty input renders nothing', () => {
  for (const v of [undefined, null, '', 42, {}]) assert.equal(renderMarkdown(v), '');
});
