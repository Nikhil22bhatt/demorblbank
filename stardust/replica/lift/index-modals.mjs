// index-modals.mjs — re-author the homepage's two hidden dialogs (#netBanking "Credit Card Bill
// Payment Options", #billdesk-modal "Attention !!") from the settled capture as clean markup:
// verbatim text, links and images; vendor classes, inline styles, scripts and form plumbing dropped.
// Writes stardust/replica/lift/index-modals.html. Usage: node index-modals.mjs <root>
import { createRequire } from 'module';
import fs from 'fs';
const require = createRequire('/app/node_modules/');
const cheerio = require('cheerio');
const root = process.argv[2] || '.';
const $ = cheerio.load(fs.readFileSync(`${root}/stardust/current/pages/index.html`, 'utf8'));
const KEEP = new Set(['h3', 'h5', 'p', 'ul', 'li', 'a', 'img', 'button', 'strong', 'b', 'u', 'br', 'hr', 'span', 'div', 'label', 'input']);
const ATTR = { a: ['href', 'id'], img: ['src', 'alt'], input: ['type', 'name', 'id', 'value'], label: ['for'], div: ['id'], button: [] };
function clean(node) {
  if (node.type === 'text') return node.data.replace(/\s+/g, ' ');
  if (node.type !== 'tag') return '';
  const tag = node.name;
  if (tag === 'script' || tag === 'style' || tag === 'svg') return '';
  const inner = (node.children || []).map(clean).join('');
  if (!KEEP.has(tag)) return inner;
  const attrs = (ATTR[tag] || []).filter((k) => node.attribs[k] != null)
    .map((k) => ` ${k}="${String(node.attribs[k]).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`).join('');
  if (tag === 'img' || tag === 'input' || tag === 'br' || tag === 'hr') return `<${tag}${attrs.replace(/src="\/(?!\/)/, 'src="https://www.rbl.bank.in/')}${tag === 'img' ? ' loading="lazy"' : ''}>`;
  if (tag === 'div' && !attrs && !inner.trim()) return '';
  if (tag === 'button') return `<button type="button">${inner}</button>`;
  return `<${tag}${attrs}>${inner}</${tag}>`;
}
const flatten = (html) => html;
const dlg = (id, labelId, body) => `<div class="hp-dialog" id="${id}" role="dialog" aria-modal="true" aria-labelledby="${labelId}" hidden>\n<div class="hp-dialog__box">${body}</div>\n</div>`;
const nb = $('#netBanking .modal-content').get(0);
const bd = $('#billdesk-modal .modal-content').get(0);
let nbHtml = flatten(clean(nb)).replace('<h5>Credit Card Bill Payment Options</h5>', '<h5 id="netBankingLabel">Credit Card Bill Payment Options</h5>');
let bdHtml = flatten(clean(bd)).replace('<h5>Attention !!</h5>', '<h5 id="billdeskLabel">Attention !!</h5>');
const out = `<div class="hp-dialogs">\n${dlg('netBanking', 'netBankingLabel', nbHtml)}\n${dlg('billdesk-modal', 'billdeskLabel', bdHtml)}\n</div>\n`;
fs.writeFileSync(`${root}/stardust/replica/lift/index-modals.html`, out);
console.log('wrote index-modals.html', out.length);
