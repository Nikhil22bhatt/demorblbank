const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];

let uid = 0;

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === undefined || v === null || v === false) return;
    if (k === 'className') node.className = v;
    else if (k === 'text') node.textContent = v;
    else node.setAttribute(k, v === true ? '' : v);
  });
  node.append(...children);
  return node;
}

/** Splits a row into heading, plain text nodes and links. */
function readRow(row) {
  const heading = row.querySelector('h1, h2, h3, h4, h5, h6');
  const links = [...row.querySelectorAll('a[href]')];
  const texts = [];
  row.querySelectorAll(':scope > div').forEach((cell) => {
    const parts = cell.querySelectorAll(':scope > p, :scope > ul, :scope > ol');
    const nodes = parts.length ? [...parts] : [cell];
    nodes.forEach((n) => {
      if (n === heading || n.contains(heading)) return;
      const onlyLink = n.querySelector('a') && n.textContent.trim() === n.querySelector('a').textContent.trim();
      if (onlyLink) return;
      if (/^\d{4}$/.test(n.textContent.trim())) return; // archive start year
      if (n.textContent.trim()) texts.push(n);
    });
  });
  const yearToken = [...row.querySelectorAll(':scope > div')]
    .map((c) => c.textContent.trim()).find((t) => /^\d{4}$/.test(t));
  return {
    heading, texts, links, yearToken,
  };
}

function headingEl(heading, fallback) {
  const h = el('h2', { className: 'blog-tools-title' });
  h.textContent = heading ? heading.textContent.trim() : fallback;
  return h;
}

function buildNewsletter(data) {
  uid += 1;
  const id = `blog-tools-${uid}`;
  const panel = el('div', { className: 'blog-tools-panel blog-tools-newsletter' });
  panel.append(headingEl(data.heading, 'Newsletter'));

  // first text is the description; a later text is the consent statement
  const [desc, ...others] = data.texts;
  if (desc) panel.append(el('p', { className: 'blog-tools-description', text: desc.textContent.trim() }));
  const consentText = others.map((n) => n.textContent.trim()).join(' ');

  const action = data.links[0];
  const form = el('form', {
    className: 'blog-tools-form',
    action: action ? action.href : undefined,
    method: 'post',
    novalidate: true,
  });
  const emailId = `${id}-email`;
  form.append(
    el('input', {
      id: emailId,
      className: 'blog-tools-input',
      type: 'email',
      name: 'email',
      required: true,
      autocomplete: 'email',
      placeholder: 'email@address.com',
      'aria-label': 'Email address',
    }),
  );
  if (consentText) {
    const consentId = `${id}-consent`;
    form.append(el('div', { className: 'blog-tools-consent' }, [
      el('input', {
        id: consentId, type: 'checkbox', name: 'consent', required: true,
      }),
      el('label', { for: consentId, text: consentText }),
    ]));
  }
  const status = el('p', { className: 'blog-tools-status', role: 'status', 'aria-live': 'polite' });
  form.append(el('div', { className: 'blog-tools-actions' }, [
    el('button', { type: 'submit', className: 'button', text: action ? action.textContent.trim() || 'Subscribe' : 'Subscribe' }),
  ]), status);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type=email]');
    const consent = form.querySelector('input[type=checkbox]');
    if (!email.checkValidity() || !email.value) {
      status.textContent = 'Please enter a valid email address.';
      email.focus();
      return;
    }
    if (consent && !consent.checked) {
      status.textContent = 'Please accept the consent to subscribe.';
      consent.focus();
      return;
    }
    if (!form.action || form.getAttribute('action') === null) {
      status.textContent = 'Thank you for subscribing.';
      form.reset();
      return;
    }
    try {
      const resp = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: { email: email.value, consent: consent ? consent.checked : undefined },
        }),
      });
      status.textContent = resp.ok ? 'Thank you for subscribing.' : 'Something went wrong. Please try again.';
      if (resp.ok) form.reset();
    } catch {
      status.textContent = 'Something went wrong. Please try again.';
    }
  });

  panel.append(form);
  return panel;
}

function buildArchives(data) {
  uid += 1;
  const id = `blog-tools-${uid}`;
  const panel = el('div', { className: 'blog-tools-panel blog-tools-archives' });
  panel.append(headingEl(data.heading, 'Archives'));

  const link = data.links[0];
  const base = link ? link.href : `${window.location.origin}/blog`;
  const now = new Date();
  const currentYear = now.getFullYear();
  const startYear = Math.min(Number(data.yearToken) || currentYear - 5, currentYear);

  const yearSelect = el('select', { id: `${id}-year`, name: 'year' });
  for (let y = currentYear; y >= startYear; y -= 1) {
    yearSelect.append(el('option', { value: String(y), text: String(y) }));
  }
  const monthSelect = el('select', { id: `${id}-month`, name: 'month' });
  MONTHS.forEach((m, i) => {
    monthSelect.append(el('option', { value: String(i + 1).padStart(2, '0'), text: m }));
  });
  monthSelect.value = String(now.getMonth() + 1).padStart(2, '0');

  const form = el('form', { className: 'blog-tools-form', action: base, method: 'get' }, [
    el('div', { className: 'blog-tools-fields' }, [
      el('div', { className: 'blog-tools-field' }, [
        el('label', { for: yearSelect.id, text: 'Year' }), yearSelect]),
      el('div', { className: 'blog-tools-field' }, [
        el('label', { for: monthSelect.id, text: 'Month' }), monthSelect]),
    ]),
    el('div', { className: 'blog-tools-actions' }, [
      el('button', { type: 'submit', className: 'button', text: (link && link.textContent.trim()) || 'Submit' }),
    ]),
  ]);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = new URL(base, window.location.href);
    url.searchParams.set('year', yearSelect.value);
    url.searchParams.set('month', monthSelect.value);
    window.location.href = url.toString();
  });
  panel.append(form);
  return panel;
}

/**
 * Blog tools: newsletter signup and archive (year/month) selector.
 * Row containing "archive" in its heading/text builds the archive panel;
 * any other row builds the newsletter panel.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  const panels = [];
  rows.forEach((row) => {
    if (!row.textContent.trim() && !row.querySelector('a')) return;
    const data = readRow(row);
    const label = (data.heading ? data.heading.textContent : row.textContent).toLowerCase();
    if (label.includes('archive')) panels.push(buildArchives(data));
    else panels.push(buildNewsletter(data));
  });
  if (!panels.length) return;
  block.replaceChildren(...panels);
}
