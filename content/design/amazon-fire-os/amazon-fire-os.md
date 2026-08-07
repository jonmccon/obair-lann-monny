---
title: Amazon Digital Devices Group | UX Designer | Jonny McConnell
description: UX case study — adapting Android 9 Pie features for Fire OS 7, shipped to 40M+ active devices as part of Amazon's largest OS rollout.
category: Amazon
date: 2019-05-01
thumbnail: /img/thumbnails/amazon-fire-os-thumb.png
draft: false
featured: false
semiFeatured: false
tags:
  - ux
  - product
  - mobile
images:
  - src: "./content/design/amazon-fire-os/ama-01.png"
  - src: "./content/design/amazon-fire-os/ama-02.png"
  - src: "./content/design/amazon-fire-os/ama-03.png"
  - src: "./content/design/amazon-fire-os/ama-04.png"
  - src: "./content/design/amazon-fire-os/ama-05.png"
  - src: "./content/design/amazon-fire-os/ama-06.png"
  - src: "./content/design/amazon-fire-os/ama-07.png"
  - src: "./content/design/amazon-fire-os/ama-08.png"
  - src: "./content/design/amazon-fire-os/ama-09.png"
---

Designing at the OS level means your decisions don't ship to a userbase, they ship to a baseline. The Fire OS 7 rollout reached 40 million active Kindle and Fire devices. Every UI pattern, memory tradeoff, and accessibility update I contributed became part of the software layer that every mainstream Amazon tablet ran on for the next three years.

**Role:** UX/UI Designer · **Company:** Amazon, Digital Devices Group · **Timeline:** 2018–2019 · **Team:** 6-person tablet design team; 2 designers dedicated to the OS-level update · **Platform:** Android & Fire Tablets (OS-level) · **Tools:** Sketch, Photoshop, Amazon internal design system · **Status:** Shipped in 2019 on new devices; OTA upgrade rollout 2020

## The Problem

Fire OS was already a version behind Android's release cycle when I joined the project. The gap was causing real user pain — not just a cosmetic update. Devices were stalling, media playback was desyncing, and on lower-end hardware you'd see single-digit frame rates as the device tried to cache Amazon's full content integration layer. Essentially, all the work that had gone into making an Android fork into a custom Amazon experience was choking the cheaper hardware that Amazon was leveraging as a sales advantage.

Android 9 Pie's core upgrades were around memory management and performance scaling, which made it the right release to close the gap on. But beyond the stability fixes, there was a long list of new interaction patterns to work through: how does a Pie feature land in a Fire mindset? What does a user on a $50 Fire 7 expect versus someone on a new Fire HD 10?

## Designing for the Floor, Not the Ceiling

The constraints were real. Many of the new Android features assumed hardware we didn't have — built around high-refresh displays, ample RAM, and fast storage. We were designing for 1GB and 2GB RAM ceilings, not the upper-end models.

I was one of two designers focused specifically on the OS-level update, working within a 6-person tablet design team where others were focused on individual apps and experiences. My specific contributions spanned the system UI layer: the new Quick Settings panel, App Shelf, Pane Navigation redesign, Settings app reorganization, and the visual accessibility updates across font and icon systems. I also worked closely with engineering to review and resolve the performance/fidelity tradeoffs that came up throughout.

My background with Material Design gave me a working translation layer — I understood the intent behind Android's patterns well enough to adapt them rather than just copy them.

## Progressive Enhancement at the OS Level

I approached this work from the lens of progressive enhancement. The newest Android features weren't designed to run on budget hardware, but the *user experiences* they enabled — faster task switching, cleaner notification management, better accessibility controls — those goals were achievable at lower fidelity. The question was how to get there without taxing the hardware.

That meant a lot of time sitting with the engineering team reviewing specific tradeoffs:

- Should we cut this animation to prioritize the actual feature call, or add a simpler one to mask the load time?
- How much should we cache to show a page immediately versus loading faster but blank?
- Where does perceived performance end and actual performance begin?

The answer we landed on was a deliberate simplification: not cutting features, but cutting complexity from how they were expressed. Perceived panel physics tuned down, lower frame rate targets for transitions, load-in placeholders timed to user expectations. The goal was to anticipate what the user expected without overtaxing what the hardware could actually deliver.

## What Shipped

- **App Shelf** — reorganized the home screen app layer, making primary content more accessible without deep navigation
- **Pane Navigation** — consolidated content panels to increase readability and fit more inventory in view (measured outcome: increased on-screen ASIN count by 2–3×)
- **Quick Settings Drop-Down Panel** — added profile management, Show Mode toggle for kiosk-style UI, priority settings access as single-tap actions
- **Settings App** — reorganized to surface Alexa integration, Fire OS priority controls (silent, do not disturb, nightlight)
- **Visual Accessibility** — font and icon library updates, sizing improvements across system menus
- **Silk Browser** — background search process improvements, search priority reordering (Amazon Shopping → user media library → general web)

<div class="two-column">

{% image "./ama-01.png", "Fire OS 7 home screen and App Shelf redesign" %}

{% image "./ama-02.png", "Pane Navigation layout" %}

{% image "./ama-03.png", "Quick Settings drop-down panel" %}

{% image "./ama-04.png", "Settings app reorganization" %}

</div>

<div class="two-column">

{% image "./ama-05.png", "Visual accessibility updates — font and icon system" %}

{% image "./ama-06.png", "Silk Browser search priority redesign" %}

{% image "./ama-07.png", "Show Mode kiosk UI toggle" %}

{% image "./ama-08.png", "Fire OS 7 system UI detail" %}

</div>

{% image "./ama-09.png", "Fire OS 7 — shipped to 40M+ active Amazon tablet devices" %}

## Impact

The Fire OS 7 rollout shipped on new device hardware in 2019, then via OTA upgrade to existing devices in 2020 — reaching 40M+ active users. The Pane Navigation redesign increased on-screen ASIN count by 2–3×, and the memory and performance work served as the software baseline for every mainstream Amazon tablet sold over a three-year period.

## In Retrospect

In the moment I was focused squarely on the translation problem — how do you adapt Google's design language into what's appropriate for an Amazon fork? It felt like that framing limited me. There was a bigger opportunity to look at all of Amazon's apps and pull the whole interaction language together into something more coherent, rather than treating each update as a porting exercise.

What's interesting in retrospect is that this feeling was apparently shared across the organization. Amazon eventually built [Vega OS](https://developer.amazon.com/apps-and-games/vega) as a platform that runs closer to the metal — making some of the architectural decisions we were working around simply irrelevant. In some ways the constraints we were designing for pointed toward a cleaner foundation that took another few years to arrive.

<!--
PREVIOUS BODY (backed up from pre-migration stub):

As a member of the Digital Devices Group, I helped migrate the release of Android P into Amazon's Kindle tablet os. Developed ux adaptations & updated visual treatments of existing and net new system level features including the architecture of the home app launcher, content organization & recommendations, search results, top toggle, status alerts, and dark theme treatments.
-
Along with balancing the performance on a different hardware spec and different appstore architecture of the Amazon product ecosystem.
-
Available on Amazon

https://amazon.design/
https://developer.amazon.com/docs/fire-tv/fire-os-overview.html
https://www.amazon.com/dp/B07FKR6KXF/ref=cm_sw_r_tw_dp_U_x_zBX5EbR8RPXWF
-->
