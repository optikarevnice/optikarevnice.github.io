---
title: Informace
subtitle: Praha-Radotín/Řevnice
layout: page
show_sidebar: true
hide_hero: true
top_blocks: home_blocks
show_sidebar: false

---
{% assign blocks = site.data[page.top_blocks] %}
<div class="container">
    <div class="columns is-multiline is-centered">
        {% for block in blocks.items %}
            <div class="column is-4 {{ block.class}}">
                <p class="title is-5 has-text-centered">{{ block.title }}</p>
                {% for part in block.parts %}
                  <p class="subtitle is-5 has-text-centered">{{ part.subtitle }}</p>
                  <div class="content">
                      <p>{{ part.description | markdownify }}</p>
                  </div>
                {% endfor %}
            </div>
        {% endfor %}
    </div>
</div>
