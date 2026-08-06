---
title: Resonance AI
description: Designed an end-to-end ML-powered video analysis platform for broadcast TV studios - turning machine-generated audience insights into actionable daily intelligence and a self-serve analytics product.
category: Resonance AI
bgColor: black
date: 2021-08-01
draft: false
featured: false
semiFeatured: false
thumbnail: /img/thumbnails/resai-thumb.png
tags:
  - data-visualization
  - ai
  - product
images:
  - src: "./content/design/resai/RAI-01-frame-233-29.png"
  - src: "./content/design/resai/RAI-02-frame-233-376.png"
  - src: "./content/design/resai/RAI-03-platform-dashboard-amhq.png"
  - src: "./content/design/resai/RAI-04-weekly-recap-ktrk.png"
  - src: "./content/design/resai/RAI-05-design-system-and-ml-pipeline.png"
  - src: "./content/design/resai/RAI-06-wireframes-analysis-platform.png"
  - src: "./content/design/resai/RAI-07-research-ideation-sketches.png"
  - src: "./content/design/resai/RAI-08-data-viz-color-research.png"
  - src: "./content/design/resai/RAI-09-topic-coverage-dashboard.png"
---

Broadcast TV had never had a real feedback loop between what aired and how audiences actually behaved. I designed the end-to-end product experience for Resonance AI's machine learning platform — transforming ML-generated video analysis into actionable audience intelligence for live TV production studios, and building the automated reporting pipeline that replaced days of manual analyst work.

**Role:** Product Designer · **Company:** Resonance AI, local tech startup · **Timeline:** 2021 · **Team:** 15 person company, solo designer · **Platform:** Responsive Web, Email · **Tools:** Figma, Databricks, Python, HTML, CSS, JS · **Status:** Shipped, acquihired

Production teams at broadcast news stations made scheduling, talent, and content decisions largely blind. Nielsen TV Ratings provided a score, but it was self-reported by viewers — not truly representative of how audiences actually behaved in front of their TVs.

Resonance AI had built something different: a machine learning pipeline that extracted dozens of previously unavailable metrics directly from video — people and object recognition, topic and sentiment analysis, lighting and set design scoring — then correlated that against real set-top-box behavior, channel by channel, to understand when someone was watching and why. The data was real, the signal was strong, and the product was compelling. The problem was it wasn't being communicated that way.

My opportunity was to take what took multiple days of manual reporting to compile and annotate, and turn it into two things: a simple daily digest production teams could act on, and a deeper self-serve analysis platform for their customers at production houses. The constraint wasn't technical — the analysis pipeline worked. The gap was trust and actionability: how do you present machine-generated insights so a human believes them and knows what to do next?

## My Role

Resonance AI brought me in as sole product designer with a clear mandate: give the company a coherent public face and turn raw ML output into something clients could act on. I was responsible for everything from brand identity through product UX, working directly with the founders, data scientists, technical project manager, and lead frontend engineer. My contribution was the full design system, the automated email reporting format, and the interaction design for the self-serve analysis platform.

## The Audit

My first pass through the work Resonance was doing exposed an immediate tension: the machine learning underneath was genuinely sophisticated — correlating real audience behavior against on-screen content at a granularity Nielsen couldn't touch — but the presentation was fragmented. Reports were assembled by hand in slide decks every time a client needed them. Data points came out as individual charts with no thread between them. The brand materials were inconsistent. The product looked less credible than it was.

The initial audit was a mix of desk research, conversations with the team, and sketching out what a coherent presentation system would need to hold.

{% image "./RAI-07-research-ideation-sketches.png", "Early ideation: information hierarchy sketches, whiteboard sessions with the team exploring the data model, and a 9-variant layout grid testing how to arrange the metrics." %}

## Design System

Before the product could be redesigned, the brand needed a foundation to design against. The rebrand work established the visual language the whole product would run on: two type families, a structured icon system, a dark-first color palette suited to data-dense environments, and the existing spiral mark that signaled signal-from-noise.

Critically, this wasn't just cosmetic. The design system encoded decisions about how ML-generated data should be presented — what made a chart trustworthy, how to group correlated signals so the relationship was legible, what a "1+1=3" data pairing looked like when the components were individually weaker than the story they told together.

<div class="two-column">

{% image "./RAI-05-design-system-and-ml-pipeline.png", "The design system: typography scale, icon set, brand mark, and the Resonance Process technical diagram showing the ML pipeline from raw video input through commercial detection, content scoring, and the final resonance model output." %}

{% image "./RAI-08-data-viz-color-research.png", "Color palette development: sequential and diverging scales tested programmatically, with hex values and heatmap outputs used to validate legibility across the full data range." %}

</div>

Part of establishing that visual language meant doing real color research in Python — building and testing diverging and sequential palette scales against actual data outputs to find what was perceptually accurate, not just aesthetically pleasing.

## Daily Pulse

The Daily Pulse was the flagship automated deliverable: a nightly email sent directly to broadcast news production teams with their audience data packaged into a scannable digest. Each report surfaced competitor ranking, audience completion trend, episode topic resonance (the treemap), and talent performance — all data that previously required days of manual analyst work.

The report was prototyped in Python, iterated against real data, and shipped to all clients on an automated cadence. The format was designed to be read in under two minutes: rankings at the top, then completion curves, then the topic breakdown and talent data. Everything a producer needed to prep for the next day's editorial meeting.

<div class="two-column">

{% image "./RAI-01-frame-233-29.png", "Daily Pulse for a broadcast news client: competitor ranking, audience completion trend, topic treemap, and talent performance, delivered automatically each morning." %}

{% image "./RAI-02-frame-233-376.png", "The same format adapted for a Weather Channel client, designed to scale across different programming types while keeping the digest scannable." %}

</div>

## Analysis Platform

The natural next step was letting clients build their own questions. The individual daily reports demonstrated the signal. The platform let production teams explore it themselves — selecting shows, adjusting date ranges, drilling into topic coverage, talent correlation, and audience completion without waiting for an analyst to compile a deck.

Think of it as Google Analytics for broadcast TV: the same data that powered the automated reports, now navigable, filterable, and explorable on demand.

{% image "./RAI-06-wireframes-analysis-platform.png", "Wireframes for the analysis platform: the video player + correlated data timeline, metric groups, single vs. multi-episode navigation modes, and filter interaction patterns." %}

<div class="two-column">

{% image "./RAI-03-platform-dashboard-amhq.png", "Production version of the platform: Audience Completion and Content Pulse charts with correlated talent/topic/sentiment strips and a live video thumbnail feed, designed for production teams to diagnose what drove performance on any given day." %}

{% image "./RAI-04-weekly-recap-ktrk.png", "The Weekly Recap variant: a longer-form digest combining talent radar charts, topic treemap, sentiment heatmap, and completion trend lines — designed for editorial strategy meetings." %}

</div>

{% image "./RAI-09-topic-coverage-dashboard.png", "Topic coverage analysis: a horizontal resonance breakdown by news category, showing both share and resonance delta — which topics landed, which didn't, and by how much." %}

## Outcomes

- Reporting cadence increased from weekly to daily — production teams could act on the previous night's data before the day's editorial meeting
- Automated the full report compilation and delivery pipeline, reducing client manager task time by 95% — what took multiple hours of manual analyst work per client per week became overnight and hands-off
- Shipped the Daily Pulse to all active clients; Weekly Recap delivered as a complementary format for editorial strategy use
- Established a full design system: type, iconography, chart language, color system that became the visual standard across all Resonance AI materials
- Built the information architecture and interaction design for the self-serve analysis platform, enabling clients to explore audience data independently for the first time
- Company was acquihired; the product's value drove the outcome

## Reflection

Looking back, the questions the Resonance AI pipeline was asking of video data were precursors to what large language models are doing at scale now: extracting meaning from unstructured media, correlating behavior signals, surfacing the "why" behind human attention. We were doing that work in 2021, but there wasn't yet a shared vocabulary for it — and I think the clients needed the charts and the branded presentation partly as a trust layer, a way to feel like the machine was showing its work.

If I were doing this now, I'd want to experiment with a more transparent interface — something that exposed the model's questions and reasoning more directly, not just the scored outputs. The data was honest. The presentation was designed to make it feel safe. That's the right instinct for where the market was, but it's a tension worth naming.

<!-- PREVIOUS BODY (backed up from pre-migration stub):

[] two versions of the copy

[] add bit about auditing the system

Content & performance analysis

The summer of 2021 was all about boiling down disparate data points into storytelling elements. As the sole designer for [Resonance AI](https://www.resonanceai.com/) I was able to reorient the brand & product to be an opinionated feedback platform for video & TV production clients. Two fonts were chosen to provide a distinction between hard data and analysis, as well as exploring color pallettes that created understandable distinction of an desired outcome. Taking these visual standards and combining multiple datapoints in novel ways, I created charting systems that individually represented a section of episode performance but that could be read together overall due to the shared design system.

Once we had an understanding of how we wanted the charting to work, I prototyped them in Plotly / vanilla js with mock data and migrated them to Plotly / Jupyter before handing it off to the engineering team.

-
Platform redesign for a machine learning video feedback platform. Initially the data from the ML scientists was being represented as individual data points and the product & marketing teams needed to decipher and present the story of their work to customers. I approached the work as a rebranding of the company and revamping of how the proprietary data is presented. 

In collaboration with Dan Wiegand, I helped build data visualizations that were emailed daily & weekly to customers consolidating their show's performance. After automating this previously manual task, our work focused on building an episode analyzer so that a customer could dig in to the details of who & what was on screen at a given moment and corroborated this data against audience attendance. 

https://twitter.com/stopitdan

-->
