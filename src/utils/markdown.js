import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Article content and artist bios are stored as Markdown and rendered with
// dangerouslySetInnerHTML -- so the rendered HTML is sanitized here, at
// render time, every time. That covers legacy rows and any write path
// (admin UI, API, database restore). The stored Markdown itself is never
// rewritten, so the admin editor always shows exactly what was typed.

// Markdown's safe vocabulary: text formatting, headings, lists, quotes,
// code, tables, links and images. No scripts, iframes, forms, SVG/MathML,
// <style>, inline style="", event handlers, class/id, or data-* attributes.
const ALLOWED_TAGS = [
  'p', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 's', 'del', 'mark', 'small', 'sub', 'sup', 'abbr',
  'blockquote', 'ul', 'ol', 'li',
  'code', 'pre',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td',
  'a', 'img', 'figure', 'figcaption', 'span', 'div',
];
const ALLOWED_ATTR = ['href', 'title', 'src', 'alt', 'width', 'height', 'align', 'start', 'reversed', 'colspan', 'rowspan'];

// Links/images may only use http(s), mailto:, tel:, or relative/fragment
// URLs. javascript:, vbscript:, data: (except data: images, which can't run
// script), file:, etc. are stripped.
const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;

const PURIFY_CONFIG = {
  ALLOWED_TAGS,
  ALLOWED_ATTR,
  ALLOWED_URI_REGEXP,
  ALLOW_DATA_ATTR: false,
  ALLOW_ARIA_ATTR: false,
};

let hooksInstalled = false;
function installHooks() {
  if (hooksInstalled) return;
  hooksInstalled = true;
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.hasAttribute('href')) {
      // No window.opener access or referrer leakage from user-authored links.
      node.setAttribute('rel', 'noopener noreferrer');
    }
    if (node.tagName === 'IMG') {
      node.setAttribute('referrerpolicy', 'no-referrer');
      node.setAttribute('loading', 'lazy');
    }
  });
}

/**
 * Renders Markdown to sanitized HTML. Fails closed: if DOMPurify can't run
 * (no DOM), nothing is rendered rather than unsanitized HTML.
 * @param {unknown} markdown
 * @returns {string}
 */
export function renderMarkdown(markdown) {
  if (typeof markdown !== 'string' || markdown === '') return '';
  if (!DOMPurify.isSupported) return '';
  installHooks();
  const html = marked.parse(markdown, { async: false });
  return DOMPurify.sanitize(html, PURIFY_CONFIG);
}
