---
layout: single
title: "Concepten & Geplande Blogs (Preview)"
permalink: /preview/drafts/
description: "Overzicht van alle blogs die nog in draft staan of gepland zijn voor de toekomst."
lang: nl
sitemap: false
search: false
share: false
related: false
---

# Concepten & Geplande Blogs

Hieronder vind je een overzicht van alle blogs die nog in concept (draft) zijn of gepland staan voor de toekomst. Deze pagina is alleen vindbaar via directe link en wordt niet opgenomen in de sitemap of zoekresultaten.

<ul>
{% assign now = 'now' | date: '%s' %}
{% for post in site.posts %}
  {% assign post_time = post.date | date: '%s' %}
  {% if post.draft == true or post_time > now %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <span style="color: #888; font-size: 0.9em;">({{ post.date | date: '%Y-%m-%d' }})</span>
      {% if post.draft == true %}<span style="color: #c00; font-size: 0.9em;">[DRAFT]</span>{% endif %}
      {% if post_time > now %}<span style="color: #06c; font-size: 0.9em;">[GEPLAND]</span>{% endif %}
    </li>
  {% endif %}
{% endfor %}
</ul>

<p style="color: #888; font-size: 0.9em;">Let op: deze pagina is alleen zichtbaar via directe link en wordt niet publiek gelinkt.</p>
