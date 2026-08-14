---
title: Awake Chocolate
description: A store locator built from a custom Google Maps theme and a lot of geocoding
category: Tether
date: 2013-06-01
draft: true
thumbnail: /img/thumbnails/awake-thumb.png
tags:
  - web
  - mobile
  - branding
images: 
- src: "content/design/awake-chocolate/awake-00.png"
- src: "content/design/awake-chocolate/awake-01.png"
- src: "content/design/awake-chocolate/awake-02.png"
- src: "content/design/awake-chocolate/awake-03.png"
- src: "content/design/awake-chocolate/awake-04.png"
- src: "content/design/awake-chocolate/awake-05.png"
---

Awake Chocolate made caffeinated chocolate bars and needed a way to help people find them. I built a store locator — a simple enough idea that turned into a deep dive on Google Maps JSON theming and a lot of manual geocoding.

The design had to feel like the product: rich browns, warm leather textures, the brand's blocky type. Getting Google Maps to match that meant tuning every road, water, and label layer through the Styled Map Wizard until the map looked less like a utility and more like part of the interface. The desktop view, the mobile search, the results list, the directions screen — all of it had to hold together in one colour story.

The harder part was the data. Awake was distributed across gas stations in Ontario at the time, and none of that was in a clean database. I geocoded the locations by hand, one by one, until the map had enough pins to be useful.

Early career work, but it taught me that map-based UIs are almost entirely a data problem dressed up as a design problem.

<div class="two-column">

{% image "./awake-04.png", "Awake Chocolate mobile store locator landing screen" %}

{% image "./awake-05.png", "Awake Chocolate mobile results list" %}

{% image "./awake-02.png", "Awake Chocolate desktop store locator with map results" %}

{% image "./awake-03.png", "Awake Chocolate desktop directions and flavors view" %}


</div>
