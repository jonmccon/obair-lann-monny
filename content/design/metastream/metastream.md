---
title: Metastream | Product Designer | Jonny McConnell
pageHeadline: Metastream Location Chat
description: A location-locked social layer for Seattle, content unlocked by physical presence, built as a PWA over six years with co-founder Mike Shrieve.
category: Metastream
date: 2019-08-01
permalink: /design/metastream-location-chat/
draft: true
featured: true
semiFeatured: true
thumbnail: /img/thumbnails/metastream-thumb.png
tags:
  - ux
  - product
  - mobile
  - web
images:
- src: "./content/design/metastream/ms-20.png"
- src: "./content/design/metastream/ms-21.png"
- src: "./content/design/metastream/ms-23.png"
- src: "./content/design/metastream/ms-24.png"
- src: "./content/design/metastream/ms-30.png"
- src: "./content/design/metastream/ms-35.png"
- src: "./content/design/metastream/ms-40.png"
- src: "./content/design/metastream/ms-50.png"
- src: "./content/design/metastream/ms-60.png"
- src: "./content/design/metastream/ms-70.png"
- src: "./content/design/metastream/ms-75.png"
- src: "./content/design/metastream/ms-80.png"
- src: "./content/design/metastream/ms-85.png"
- src: "./content/design/metastream/ms-86.png"
- src: "./content/design/metastream/ms-90.png"
- src: "./content/design/metastream/ms-95.png"
- src: "./content/design/metastream/ms-100.png"
- src: "./content/design/metastream/ms-110.png"
- src: "./content/design/metastream/ms-120.png"
- src: "./content/design/metastream/ms-125.png"
- src: "./content/design/metastream/ms-130.png"
---

The question Metastream tried to answer: what if the people around you right now — at this café, this park, this corner — could leave something for whoever came next?

*Metastream sought to engage with the cohabitants of Seattle through an augmented reflection our environmental timeline. A map to see and understand surrounding realtime data and accessible only by being near a physical locale.* 

- **Role:** Co-founder, UX / Product Design
- **Collaborator:** Mike Shrieve (engineering, all browser implementations)
- **Built on:** React PWA · Mapbox · Firebase · Google Cloud Platform · OpenStreetMap · Node.js · GitLab

It was a location-locked social layer for Seattle. The map only showed you content from your immediate area, unlocked by physical presence. Tap a locale marker and you'd see its rating, the messages people had left, and who else had been there. Leave a post of your own. Come back tomorrow and it would have grown.

I co-founded the project with [Mike Shrieve](https://twitter.com/untelcombat), who built everything that ran in a browser: the React progressive web app, the Mapbox rendering pipeline, the Firebase real-time backend, user auth, geo-fenced queries, installable PWA on Android. I designed the product — user flows, the proximity model that determined what you could see, map interaction states, locale card layouts, how we'd handle unauthenticated users, when to ask for GPS permission, what happened when you deep-linked into a specific place.

We went from a rough concept sketch pulling geolocated feeds onto a tilted 3D city map to a working, deployed PWA at [metastre.am](https://d.metastre.am/). We built a Sculpture Park installation-specific build. We ran it against live [OpenStreetMap](https://www.openstreetmap.org/) data and public [City of Seattle datasets](https://data.seattle.gov/). Six years of nights and weekends, learning things neither of us knew when we started — Node, Firebase, how to run a product together.

*We decided to stop before we shipped. Preserving the friendship was more important than crossing the finish line. That was the right decision — and six years of real work on a real product is the record regardless.*

---

<div class="three-column">

{% image "./ms-20.png", "Metastream PWA — locale radius and map markers showing points of interest, built by Mike Shrieve" %}

{% image "./ms-21.png", "Metastream PWA — geo-fenced locale view with user post feed, built by Mike Shrieve" %}

{% image "./ms-23.png", "Metastream PWA — place detail with ratings and message thread, built by Mike Shrieve" %}

</div>

{% image "./ms-24.png", "Architecture overview and prototype map layer with locale tabs — built by Mike Shrieve, system diagram drawn by Jonny McConnell" %}

{% image "./ms-30.png", "Initial prototype with geolocated Twitter posts and OSM points of interest, neighborhood boundary overlays — built by Mike Shrieve" %}

{% image "./ms-35.png", "Twitter and OSM data study exploring non-north map orientation — built by Mike Shrieve" %}

{% image "./ms-40.png", "Locale querying based on user position — built by Mike Shrieve" %}

{% image "./ms-50.png", "Responsive web app with user login, user-generated messages attached to OSM shops, restaurants, and points of interest — built by Mike Shrieve" %}

{% image "./ms-60.png", "Mapbox visual study in map projection (left) drawn by Jonny McConnell; messaging prototype for users at a locale (right) built by Mike Shrieve" %}

{% image "./ms-70.png", "Sculpture Park installation build — Metastream PWA installed on mobile phone, location-specific content active — built by Mike Shrieve" %}

{% image "./ms-75.png", "Installation-specific content with attached user messages — built by Mike Shrieve" %}

{% image "./ms-80.png", "User flow diagrams — drawn by Jonny McConnell" %}

{% image "./ms-85.png", "User flow diagrams — drawn by Jonny McConnell" %}

{% image "./ms-86.png", "User flow diagrams — drawn by Jonny McConnell" %}

{% image "./ms-90.png", "Map interaction and messaging studies — drawn by Jonny McConnell" %}

{% image "./ms-95.png", "Map interaction and messaging studies — drawn by Jonny McConnell" %}

{% image "./ms-100.png", "Pattern and visual hierarchy studies — drawn by Jonny McConnell" %}

{% image "./ms-110.png", "Data analysis and content structure diagram — drawn by Jonny McConnell" %}

{% image "./ms-120.png", "Original concept: geolocated social feed posts layered on a 3D city map — drawn by Jonny McConnell" %}

{% image "./ms-125.png", "Original concept: real-time location feedback mechanism — drawn by Jonny McConnell" %}

{% image "./ms-130.png", "Concept exploration drawing from Normal Future — drawn by Jonny McConnell" %}
