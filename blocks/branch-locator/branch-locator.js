/**
 * branch-locator — "Find Branches & ATMs" search, filtered client-side.
 *
 * Authoring (every row optional, any order):
 *   [heading]                         form heading
 *   [State | All]                     state select label / "all" option text
 *   [City | All]                      city select label / "all" option text
 *   [Looking for | I'm Looking for]   label above the services filter
 *   [Services | list or comma text]   service filters ("Type of Service" as the list title
 *                                     may be authored in a 3rd cell); all checked by default
 *   [Search | Search] [Reset | Reset] button texts
 *   [No results | text]               empty-state message
 *   [Data | link to a .json sheet]    same-origin EDS spreadsheet with columns
 *                                     name, type, state, city, address, services, phone, link
 *   [name | type | state | city | address | services | phone/link]
 *                                     inline location row (4+ cells; services comma separated)
 *   [link] [link] …                   a row of links only: shown under the form
 *                                     (e.g. "RBL Bank Branch", "RBL Bank ATMs")
 * Results render below the form after Search. No external API calls.
 */

const KEYS = {
  state: /^state$/i,
  city: /^city$/i,
  looking: /looking/i,
  services: /^(services?|type of service)$/i,
  search: /^search$/i,
  reset: /^reset$/i,
  empty: /no results?|empty/i,
  data: /^(data|source|sheet)$/i,
};

function el(tag, className, attrs = {}) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  Object.entries(attrs).forEach(([k, v]) => node.setAttribute(k, v));
  return node;
}

const txt = (n) => (n ? n.textContent.trim() : '');
const splitList = (cell) => {
  if (!cell) return [];
  const lis = [...cell.querySelectorAll('li')];
  if (lis.length) return lis.map(txt).filter(Boolean);
  return txt(cell).split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
};

function locationFromCells(cells) {
  const [name, type, state, city, address, services, contact] = cells;
  const a = contact?.querySelector('a[href]');
  return {
    name: txt(name),
    type: txt(type),
    state: txt(state),
    city: txt(city),
    address: txt(address),
    services: splitList(services),
    phone: a ? '' : txt(contact),
    link: a ? a.href : '',
  };
}

function locationFromJson(item) {
  const get = (k) => {
    const key = Object.keys(item).find((x) => x.toLowerCase() === k);
    return key ? String(item[key] ?? '').trim() : '';
  };
  return {
    name: get('name'),
    type: get('type'),
    state: get('state'),
    city: get('city'),
    address: get('address'),
    services: get('services').split(/[,;]/).map((s) => s.trim()).filter(Boolean),
    phone: get('phone'),
    link: get('link'),
  };
}

function classify(block) {
  const cfg = {
    heading: null,
    labels: {},
    services: [],
    servicesTitle: 'Type of Service',
    locations: [],
    links: [],
    data: null,
  };
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const first = txt(cells[0]);
    if (!txt(row)) return;
    if (cells.length === 1 && row.querySelector('h1, h2, h3, h4, h5, h6')) {
      cfg.heading = row.querySelector('h1, h2, h3, h4, h5, h6');
      return;
    }
    const key = cells.length <= 3 ? Object.keys(KEYS).find((k) => KEYS[k].test(first)) : null;
    if (key === 'data') {
      const a = row.querySelector('a[href]');
      cfg.data = a ? a.href : txt(cells[1]);
    } else if (key === 'services') {
      cfg.services = splitList(cells[1]);
      if (cells[2]) cfg.servicesTitle = txt(cells[2]);
      else if (!/^services?$/i.test(first)) cfg.servicesTitle = first;
    } else if (key) {
      cfg.labels[key] = txt(cells[1]) || first;
      if (key === 'state' || key === 'city') cfg.labels[`${key}Label`] = first;
    } else if (cells.length >= 4) {
      cfg.locations.push(locationFromCells(cells));
    } else if (row.querySelector('a[href]') && txt(row).replace(/\s/g, '')
      === [...row.querySelectorAll('a')].map(txt).join('').replace(/\s/g, '')) {
      cfg.links.push(...row.querySelectorAll('a[href]'));
    } else if (row.querySelector('ul, ol')) {
      cfg.services = splitList(row.querySelector('ul, ol'));
    } else if (cells.length === 1) {
      cfg.labels.looking = first;
    }
  });
  return cfg;
}

async function loadData(url) {
  try {
    const u = new URL(url, window.location.href);
    if (u.origin !== window.location.origin) return [];
    const resp = await fetch(u);
    if (!resp.ok) return [];
    const json = await resp.json();
    return (json.data || []).map(locationFromJson);
  } catch (e) {
    return [];
  }
}

function fillSelect(select, allText, values) {
  const current = select.value;
  select.replaceChildren();
  const all = el('option', '', { value: '' });
  all.textContent = allText;
  select.append(all);
  values.forEach((v) => {
    const o = el('option', '', { value: v });
    o.textContent = v;
    select.append(o);
  });
  select.value = values.includes(current) ? current : '';
}

const uniq = (arr) => [...new Set(arr.filter(Boolean))].sort((a, b) => a.localeCompare(b));

function renderResult(loc) {
  const li = el('li', 'branch-locator-result');
  if (loc.type) {
    const t = el('span', 'branch-locator-result-type');
    t.textContent = loc.type;
    li.append(t);
  }
  const h = el('h3', 'branch-locator-result-name');
  h.textContent = loc.name;
  li.append(h);
  const addr = [loc.address, loc.city, loc.state].filter(Boolean).join(', ');
  if (addr) {
    const p = el('p', 'branch-locator-result-address');
    p.textContent = addr;
    li.append(p);
  }
  if (loc.services.length) {
    const p = el('p', 'branch-locator-result-services');
    p.textContent = loc.services.join(', ');
    li.append(p);
  }
  if (loc.phone) {
    const a = el('a', 'branch-locator-result-phone', { href: `tel:${loc.phone.replace(/[^\d+]/g, '')}` });
    a.textContent = loc.phone;
    li.append(a);
  }
  if (loc.link) {
    const a = el('a', 'branch-locator-result-link', { href: loc.link });
    a.textContent = 'View details';
    li.append(a);
  }
  return li;
}

export default async function decorate(block) {
  const cfg = classify(block);
  const uid = Math.random().toString(36).slice(2, 8);
  const form = el('form', 'branch-locator-form', { role: 'search' });
  if (cfg.heading) form.append(cfg.heading);

  const selects = el('div', 'branch-locator-selects');
  const mkSelect = (key, fallback) => {
    const wrap = el('div', 'branch-locator-select');
    const label = el('label', 'branch-locator-select-label', { for: `bl-${key}-${uid}` });
    label.textContent = cfg.labels[`${key}Label`] || fallback;
    const select = el('select', '', { id: `bl-${key}-${uid}`, name: key });
    wrap.append(label, select);
    selects.append(wrap);
    return select;
  };
  const stateSel = mkSelect('state', 'State');
  const citySel = mkSelect('city', 'City');
  form.append(selects);

  const looking = el('p', 'branch-locator-looking');
  looking.textContent = cfg.labels.looking || 'I’m Looking for';
  form.append(looking);

  const services = el('details', 'branch-locator-services', { open: '' });
  const summary = el('summary');
  summary.textContent = cfg.servicesTitle;
  const list = el('ul', 'branch-locator-service-list');
  services.append(summary, list);
  form.append(services);

  const actions = el('div', 'branch-locator-actions');
  const reset = el('button', 'branch-locator-reset', { type: 'reset' });
  reset.textContent = cfg.labels.reset || 'Reset';
  const search = el('button', 'branch-locator-search button', { type: 'submit' });
  search.textContent = cfg.labels.search || 'Search';
  actions.append(reset, search);
  form.append(actions);

  const results = el('div', 'branch-locator-results', { 'aria-live': 'polite' });
  const nodes = [form];
  if (cfg.links.length) {
    const links = el('div', 'branch-locator-links');
    cfg.links.forEach((a) => links.append(a));
    nodes.push(links);
  }
  nodes.push(results);
  block.replaceChildren(...nodes);

  let { locations } = cfg;
  if (cfg.data) locations = locations.concat(await loadData(cfg.data));

  const serviceNames = cfg.services.length
    ? cfg.services
    : uniq(locations.flatMap((l) => l.services));
  serviceNames.forEach((name, k) => {
    const li = el('li');
    const id = `bl-svc-${uid}-${k}`;
    const input = el('input', '', {
      type: 'checkbox', id, value: name, name: 'service',
    });
    input.checked = true;
    input.defaultChecked = true;
    const label = el('label', '', { for: id });
    label.textContent = name;
    li.append(input, label);
    list.append(li);
  });
  if (!serviceNames.length) {
    services.hidden = true;
    looking.hidden = true;
  }

  const allState = cfg.labels.state || 'All';
  const allCity = cfg.labels.city || 'All';
  const refreshCities = () => {
    const st = stateSel.value;
    const cities = locations.filter((l) => !st || l.state === st).map((l) => l.city);
    fillSelect(citySel, allCity, uniq(cities));
  };
  fillSelect(stateSel, allState, uniq(locations.map((l) => l.state)));
  refreshCities();
  stateSel.addEventListener('change', refreshCities);

  const show = () => {
    const st = stateSel.value;
    const ct = citySel.value;
    const checked = [...list.querySelectorAll('input:checked')].map((i) => i.value);
    const filterServices = checked.length < serviceNames.length;
    const found = locations.filter((l) => (!st || l.state === st)
      && (!ct || l.city === ct)
      && (!filterServices || l.services.some((s) => checked.includes(s))));
    results.replaceChildren();
    if (!found.length) {
      const p = el('p', 'branch-locator-empty');
      p.textContent = cfg.labels.empty || 'No branches or ATMs match your search.';
      results.append(p);
      return;
    }
    const count = el('p', 'branch-locator-count');
    count.textContent = `${found.length} result${found.length === 1 ? '' : 's'}`;
    const ul = el('ul', 'branch-locator-result-list');
    found.forEach((l) => ul.append(renderResult(l)));
    results.append(count, ul);
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    show();
  });
  form.addEventListener('reset', () => {
    setTimeout(() => {
      refreshCities();
      results.replaceChildren();
    });
  });
}
