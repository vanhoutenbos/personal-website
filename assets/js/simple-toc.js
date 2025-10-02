// simple-toc.js — generates a TOC from H2/H3 headings and inserts into #toc-placeholder
document.addEventListener('DOMContentLoaded', function(){
  const container = document.querySelector('.post-content');
  if(!container) return;
  const headings = container.querySelectorAll('h2, h3');
  if(!headings.length) return;
  const toc = document.createElement('nav');
  toc.className = 'toc';
  const ul = document.createElement('ul');
  headings.forEach(h => {
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
