---
title: Seattle Creative Directory
description: Founded and built a living directory and interview series connecting creative businesses across the Pacific Northwest — design, research, development, and production, all owned solo.
category: Directory
date: 2021-06-01
thumbnail: /img/thumbnails/scd-thumb.png
draft: false
featured: false
semiFeatured: false
tags:
  - web
  - product
  - community
  - branding
images:
  - src: "./content/design/Seattle-Creative-Directory/SCD-01-dark-filters.png"
  - src: "./content/design/Seattle-Creative-Directory/SCD-04-light-filters-open-2.png"
  - src: "./content/design/Seattle-Creative-Directory/scd-01.png"
  - src: "./content/design/Seattle-Creative-Directory/scd-02.png"
  - src: "./content/design/Seattle-Creative-Directory/scd-03.png"

---

## The Problem

The Pacific Northwest has a dense, proud creative community — and no single place to find it. So I built one. The Seattle Creative Directory is a living resource connecting creative businesses across the region, paired with an interview series where the people behind those businesses tell their own stories.

**Role:** Founder, designer, developer, researcher, producer · **Company:** Seattle Creative Directory · **Timeline:** 2020 – Present · **Platform:** Responsive web, podcast, Google Ads, social media · **Tools:** Figma, Audition, Descript, Next.js, Notion, Typeform, Mapbox, Simplecast, Vercel, NeonDB · **Status:** 268 live listings, 15 episodes on iTunes and Spotify

## The Design Problem

The Seattle Creative Directory covers design studios, creative agencies, and creative businesses across the Pacific Northwest. The community here has a fiercely strong identity and its data is scattered. Resources existed but they were incomplete, hard to find, or years out of date. There was no single place that let you filter by neighborhood, size, or specialty, or see the whole community on a map.

The design problem was taxonomic as much as technical: how do you organize 268 businesses across disciplines, scales, and geographies in a way that's useful to a recruiter, a student, and a patron all at once? The answer became a four-axis filter system — size, neighborhood, city, and tags — built on a proper relational database so it could actually stay current.

> What was a series of disparate mailing lists is made tangible and open.

## My Role

Seattle Creative Directory is a project born out of a shared vision with peer Ben Hubbard, that I founded, owned the product decisions, and have rebuilt it twice. I'm the designer, developer, researcher, and producer.

The mandate I gave myself: build the resource I wished existed. That meant owning every layer from the information architecture and filter taxonomy to the database schema and deployment pipeline. I brought in Ben Hubbard for the logo, Dustin Horn to master the audio, and Lee Gehrig for data wrangling support. Small, well-chosen contributions that multiplied the quality without diluting the product direction.

## From Static List to Living Directory

At first it was a manual list and a static site — every listing was its own Markdown file, updated by hand, with no way to filter or search. I pulled it together simply because I wanted a list of everyone I knew in town. Then I added studio mailing lists. Then companies started signing up after I implemented a simple form.

{% image "./scd-03.png", "The earliest version with the original logo by Lee Gehrig: a flat A–Z list with no filtering, no map, no database. Every entry was a hand-edited Markdown file. When it hit ~80 listings it became unmanageable." %}

It grew until I had to rebuild from scratch. The static Gatsby site meant one file per listing, no live filtering, and no search. The move to Next.js with a proper Postgres database changed all of that — suddenly a recruiter could filter by size and neighborhood, a student could search by specialty, and anyone could see the whole community plotted on a map. The stack is Next.js 14 with TypeScript, Prisma over Neon Postgres, Clerk for authentication, Stripe for ad placements, and Mapbox for the geographic layer, deployed on Vercel.

<div class="two-column">
{% image "./scd-02.png", "The rebuilt filter system: Size, Neighborhood, City, and Tags — four axes that let different users find what they need without seeing everything at once." %}
{% image "./SCD-04-light-filters-open-2.png", "Filter in use: 'recruiter' tag active, narrowing to studios that match a specific hiring context. The taxonomy was the design challenge — getting the right level of specificity without fragmenting the directory." %}
</div>

{% image "./SCD-01-dark-filters.png", "The map view plots the whole community geographically — useful for patrons looking by neighborhood, or anyone who thinks spatially about the city's creative scene." %}

{% image "./scd-01.png", "The live product: 268 listings, interview quote cards from the podcast series, light and dark modes. Six years of continuous iteration, still growing." %}

## Where It's Going

Where it's growing currently is broader reach: more listings because they're easier to manage, more natural filters for different types of users, from industry research to agency hiring. And display advertising to start pulling these goals together. The 15-episode interview series is also ongoing qualitative research into how Pacific Northwest creative businesses think about their industry, their peers, and what they're building.

It's expanding beyond design studios. This platform has legs to represent architecture and photography, letterpress and illustration, dance and theater, choir groups, musicians, glass artists, painters, woodworkers. It's a living directory for patrons to find creative individuals and a resource for cross-discipline mentorship.

## Impact

- 268 live listings across design studios, agencies, and creative businesses
- 15 podcast episodes with over 40k plays across iTunes and Spotify
- Admin dashboard supporting listing approval workflow, bulk import, and ad placement management
- Full-stack product: design, development, database architecture, and content production — all owned solo

## Why It Keeps Going

This project has lived on the back burner and come roaring back more times than I can count, and that's exactly why it matters. It has supporters. It's building something up, strengthening a community. Every time I return, there's more reason to.

I have found it to be successful in its own right, and I want to see it grow more. But I also use it selfishly to learn new skills and have a place to actually use them. So I don't think it's going anywhere. I think it's a growing portrait of myself — not every aspect of my ability or interest, but a creative portrait nonetheless.

<!-- PREVIOUS BODY (backed up from pre-migration stub):
[] update images

Seattle's creative community has a strong identity but its data is disparate, resources exist but aren't comprehensive or easy to find. So I'm starting to catalog the design studios, inhouse product groups, architecture firms, printers, photographers, letterers so we can support each other and act as resource.
-
In tandem with the website, I'm recording audio interviews with the owners of these companies in an effort to understand them, but also to understand what it means to be a creative professional.
-
A nice profile of the work was written up in Marketing NW
-
Available on Github
SeattleCreative.Directory
SeattleCreative.Show

https://bit.ly/New-Sea-Directory
https://github.com/jonmccon/seattle-creative-directory
https://seattlecreative.directory/
https://seattlecreative.show/
-->
