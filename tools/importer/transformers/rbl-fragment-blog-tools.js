/* eslint-disable */
/* global WebImporter */

/**
 * Shared fragment: blog-tools (newsletter signup + archive).
 * @templates blog-article
 *
 * Its content is identical on every blog page, so it lives once at FRAGMENT_PATH. Runs as a late
 * transformer (after block discovery): takes the blog-tools element from payload.pageBlocks,
 * moves it into a holder div, puts a `fragment` block linking to the fragment in its place,
 * parses the element inside the holder and pushes { element: holder, path } onto
 * params.fragments. The import script skips the element afterwards (it is no longer in the page).
 */
import blogToolsParser from '../parsers/blog-tools.js';

const FRAGMENT_PATH = '/fragments/blog/blog-tools';

export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;
  const { document, params } = payload;
  const blocks = (payload.pageBlocks || []).filter((b) => b.name === 'blog-tools' && b.element);
  if (!blocks.length || !params) return;
  params.fragments = params.fragments || [];

  blocks.forEach(({ element: source }, i) => {
    if (!source.parentNode) return;
    const link = document.createElement('a');
    link.href = FRAGMENT_PATH;
    link.textContent = FRAGMENT_PATH;
    const fragmentBlock = WebImporter.Blocks.createBlock(document, { name: 'fragment', cells: [[link]] });
    source.replaceWith(fragmentBlock);
    if (i > 0) return; // one fragment document per page is enough
    const holder = document.createElement('div');
    holder.append(source);
    try {
      blogToolsParser(source, { document, url: payload.url, params });
    } catch (e) {
      console.error('blog-tools fragment parse failed:', e);
    }
    params.fragments.push({ element: holder, path: FRAGMENT_PATH });
  });
}
