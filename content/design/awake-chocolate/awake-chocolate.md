---
title: Awake Chocolate | Branding | Jonny McConnell
pageHeadline: Awake Chocolate
description: A store locator built from a custom Google Maps theme and a lot of geocoding
category: Tether
date: 2013-06-01
permalink: /design/awake-chocolate/
draft: true
featured: false
semiFeatured: false
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

## The Brief

Awake Chocolate needed a store locator that felt like part of the brand, not a generic utility bolted onto the website.

- **Role:** Designer / front-end implementation
- **Client:** Awake Chocolate
- **Timeline:** 2013
- **Platform:** Responsive web store locator
- **Status:** [Released](https://awakechocolate.com/pages/store-locator)

Awake Chocolate made caffeinated chocolate bars and needed a way to help people find them in the real world. I designed and built a locator experience that worked across desktop and mobile, then pushed Google Maps styling much further than I expected to make it feel consistent with the rest of the site.

## The Problem

A store locator sounds straightforward until the map becomes the interface. The challenge was not just dropping pins on a default embed, it was making the experience feel like Awake. Rich browns, warm leather textures, and the brand's blocky type all had to carry through from the surrounding site into the search, results, and directions views.

That meant tuning the Google Maps JSON theme layer by layer until the roads, water, and labels stopped fighting the interface and started supporting it.

## The Constraint

The harder part was the data. Awake was distributed across gas stations in Ontario at the time, and the locations were not sitting in a clean, ready-to-use dataset. I geocoded the stores by hand, one by one, until the locator had enough useful coverage to work as an actual customer tool instead of just a visual concept.

That project left a lasting lesson: map-based products often look like a visual design challenge on the surface, but the real work is usually structure, coverage, and accuracy underneath.

<div class="two-column">

{% image "./awake-04.png", "Awake Chocolate mobile store locator landing screen" %}

{% image "./awake-05.png", "Awake Chocolate mobile results list" %}

{% image "./awake-02.png", "Awake Chocolate desktop store locator with map results" %}

{% image "./awake-03.png", "Awake Chocolate desktop directions and flavors view" %}


</div>
