// index-parity.mjs — DOM-parity pass for the homepage replica (recreation-procedure § Granularity parity):
// the live page's hidden-but-present DOM counts as content, so mirror it hidden, exactly as captured:
//  - authored aria-labels carried verbatim from the settled capture (matched by href+text, id, or banner art file)
//  - slick loop clones (clone of the last slide before the track, clones of every slide after), display:none
//  - slick dot buttons carry their number text and "k of n" labels; each carousel's outer single-slide
//    slick wrapper keeps its "1 of 1" dot (hidden)
//  - FD calculator: bootstrap-slider tooltips (opacity 0) and the legacy hidden citizen radio group
// Usage: import { parity } from './index-parity.mjs'; html = parity(html, root)
import { createRequire } from 'module';
import fs from 'fs';

const require = createRequire('/app/node_modules/');
const cheerio = require('cheerio');

const base = (u) => (u || '').split('?')[0].split('/').pop();
const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();
const bgOf = (el, $) => base((/url\(['"]?([^'")]+)/.exec($(el).attr('style') || '') || [])[1]);

export function parity(html, root) {
  const S = cheerio.load(fs.readFileSync(`${root}/stardust/current/pages/index.html`, 'utf8'));
  const $ = cheerio.load(html, { decodeEntities: false });
  const main = $('#content');
  const used = new Set();
  const unmatched = [];
  const take = (els) => els.filter((i, e) => !used.has(e)).first();

  /* ---- 1. aria-labels from the capture (originals only; clones copy them below) ---- */
  S('#content [aria-label]').each((i, e) => {
    if (S(e).closest('.slick-cloned').length) return;
    const L = S(e).attr('aria-label');
    if (/^\d+ of \d+$/.test(L)) return; // dots: generated below
    const tag = e.tagName; const id = S(e).attr('id') || ''; const href = S(e).attr('href') || '';
    const text = norm(S(e).text());
    let hit = $();
    if (id && !/^(range\d|fixed-deposite1|reset-btn|billdesk-modal)$/.test(id)) hit = take(main.find(`${tag}#${id}`));
    if (!hit.length && tag === 'a' && href && href !== '#') {
      const cands = main.find('a').filter((k, b) => ($(b).attr('href') || '').replace(/&amp;/g, '&') === href);
      hit = take(cands.filter((k, b) => norm($(b).text()) === text));
      if (!hit.length) hit = take(cands);
    }
    if (!hit.length && tag === 'div') {
      const f = base((/url\(['"]?([^'")]+)/.exec(S(e).attr('style') || '') || [])[1]);
      if (f) hit = take(main.find('[style*="background-image"]').filter((k, b) => bgOf(b, $) === f));
    }
    if (hit.length) { hit.attr('aria-label', L); used.add(hit[0]); } else unmatched.push(`${tag}#${id} ${href} "${L}"`);
  });
  // controls whose capture counterpart has no stable id/href in the build
  const fixed = [
    ['input[data-fdc-range="amount"]', 'Choose a value'], ['input[data-fdc-range="years"]', 'Choose an year'],
    ['input[data-fdc-range="months"]', 'Choose a month'], ['input[data-fdc-range="days"]', 'Choose the days'],
    ['#fdc-payout', 'Deposit Type'], ['#netBanking a[href="#"]', 'Close'], ['#billdesk-modal button', 'Close'], ['a[data-fdc-reset]', 'Home'], ['#billdesk-modal', 'billdesk-modalLabel'],
  ];
  for (const [sel, L] of fixed) main.find(sel).first().attr('aria-label', L);
  const unresolved = unmatched.filter((u) => !/range\d|fixed-deposite1|reset-btn|billdesk-modal|"Close"/.test(u));

  /* ---- 2. dots: number text + "k of n"; the outer wrapper's "1 of 1" dot ---- */
  main.find('[data-carousel]').each((i, car) => {
    const dots = $(car).find('.dots__dot');
    dots.each((k, d) => { $(d).attr('aria-label', `${k + 1} of ${dots.length}`).text(String(k + 1)); });
    $(car).append('<ul class="dots dots--outer" hidden><li><button type="button" aria-label="1 of 1" tabindex="-1">1</button></li></ul>');
  });

  /* ---- 3. slick loop clones: last slide before, every slide after (hidden, ids dropped) ---- */
  main.find('[data-carousel] .carousel__track').each((i, tr) => {
    const slides = $(tr).children('.carousel__slide');
    const mk = (s) => {
      const c = $(s).clone();
      c.removeClass('is-active').addClass('carousel__slide--clone').attr('aria-hidden', 'true').attr('hidden', '').attr('inert', '');
      c.removeAttr('role').removeAttr('aria-roledescription');
      c.find('[id]').addBack('[id]').removeAttr('id');
      c.find('a, button, input').attr('tabindex', '-1');
      return c;
    };
    $(tr).append(mk(slides.last()));
    slides.each((k, s) => { $(tr).append(mk(s)); });
  });

  /* ---- 4. FD calculator: slider tooltips (bootstrap-slider, opacity 0) + legacy citizen radios ---- */
  const tip = { amount: '5000', years: '1', months: '1', days: '7' };
  main.find('input.fdc-slider').each((i, r) => {
    const k = $(r).attr('data-fdc-range');
    $(r).after(`<div class="fdc-tip" role="presentation"><div class="fdc-tip__inner">${tip[k] || ''}</div></div>`);
  });
  main.find('.fdc__top').after(`<div class="fdc-legacy" hidden><div class="fdc-legacy__group"><input id="fdc-legacy-senior" name="fdc-legacy" type="radio" value="1" tabindex="-1">Are you a senior citizen? (Age 60+) <label for="fdc-legacy-senior">Are you a senior citizen? (Age 60+)</label></div><div class="fdc-legacy__group"><input id="fdc-legacy-super" name="fdc-legacy" type="radio" value="2" tabindex="-1"> <label for="fdc-legacy-super">Are you a super senior citizen? (Age 80+)</label></div></div>`);

  /* ---- 5. motion hooks (motion-observe 1440: live AOS fade-up 0.3s, once, on these six boxes) ---- */
  for (const sel of ['.fdc > .container', '.products > .container', '.products .rail', '.offers > .container', '.offers .rail', '.offers .cards-section__cta']) {
    main.find(sel).first().attr('data-aos', 'fade-up');
  }

  if (unresolved.length) console.warn(`index-parity: ${unresolved.length} capture aria-label(s) unmatched:\n  ${unresolved.join('\n  ')}`);
  return $.html();
}
