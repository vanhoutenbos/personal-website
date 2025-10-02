// simple-toc.js — generates a TOC from H2/H3 headings and inserts into #toc-placeholder
document.addEventListener('DOMContentLoaded', function(){
  const container = document.querySelector('.post-content');
  if(!container) return;
  // If the post already contains a TOC element, don't inject another one
  if (container.querySelector('.toc')) return;

  // Heuristic 1: if there's already a list near the top that contains internal links (#...),
  // assume the author added a manual TOC and don't inject.
  const firstList = container.querySelector('ul, ol');
  if (firstList) {
    const hasInternalLinks = firstList.querySelector('a[href^="#"]');
    if (hasInternalLinks) return;
  }

  // Heuristic 2: detect a manual TOC signalled by a heading like 'Inhoudsopgave' / 'Inhoud'
  // followed immediately by a list. If found, don't inject.
  const allHeadings = container.querySelectorAll('h1, h2, h3');
  for (let i = 0; i < allHeadings.length; i++) {
    const h = allHeadings[i];
    const text = (h.textContent || '').trim().toLowerCase();
    if (/^inhouds?opgave|^inhouds?/.test(text)) {
      // check nextElementSibling for a list
      const next = h.nextElementSibling;
      if (next && (next.tagName.toLowerCase() === 'ul' || next.tagName.toLowerCase() === 'ol')) {
        return; // manual TOC present
      }
    }
  }

  const hList = container.querySelectorAll('h2, h3');
  if(!hList.length) return;
  const toc = document.createElement('nav');
  toc.className = 'toc';
  const ul = document.createElement('ul');
  hList.forEach(h => {
    if(!h.id) h.id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-');
    const li = document.createElement('li');
    li.className = h.tagName.toLowerCase();
    const a = document.createElement('a');
    a.href = '#'+h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    ul.appendChild(li);
  });
  toc.appendChild(ul);
  const placeholder = document.getElementById('toc-placeholder');
  if(placeholder) placeholder.appendChild(toc);
});
