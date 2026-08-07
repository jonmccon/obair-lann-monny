---
title: Job Intelligence Scraper | Product Design | Jonny McConnell
pageHeadline: Job Intelligence Scraper
description: A personal job-search assistant that scrapes 15+ job boards, filters by role and geography using a two-tier keyword gate, then runs on-demand LLM fit analysis against my resume — all served via a local LAN dashboard with interactive filtering, cover letter generation, and ATS question scraping.
date: 2026-07-31
draft: false
featured: true
semiFeatured: false
thumbnail: /img/thumbnails/job-intelligence-scraper-thumb.png
tags:
  - ai
  - web
  - product
  - data-visualization
images:
  - src: ./content/design/job-intelligence-scraper/JIS-01-dashboard-overview.png
    alt: Job Intelligence dashboard overview — sidebar filters and job cards grouped by day
  - src: ./content/design/job-intelligence-scraper/JIS-02-apply-page.png
    alt: Apply page — fit analysis, cover letter generator, and ATS question scraping
  - src: ./content/design/job-intelligence-scraper/JIS-03-noise-filters-sidebar.png
    alt: Noise filters expanded in sidebar — non-product design roles hidden by default
  - src: ./content/design/job-intelligence-scraper/JIS-04-dashboard-analyzed.png
    alt: Dashboard with LLM fit scores rendered on candidate cards
---

Built a lean, local-first job intelligence pipeline that turns the firehose of 15+ job sources into a curated daily feed of qualified roles — then lets me click to get an honest LLM fit verdict, generate a tailored cover letter, and scrape ATS application questions, all without spending a token until I ask for it.

**Role:** Product Designer & Engineer (solo) · **Project:** Personal (job-intelligence) · **Timeline:** June 2025 – present (active, overnight cron) · **Platform:** macOS (M4 Mac mini), LAN-accessible via Tailscale · **Status:** 🟢 Active — daily collection runs at 1/4/7 AM

## The Problem

I was spending too much time manually checking job boards, copying descriptions into ChatGPT to ask "am I a fit?" then writing cover letters from scratch. The existing tools were either expensive SaaS (LinkedIn Premium, Teal, etc.) or required handing my data to a third party. I wanted something local, free to run (tokens only on demand), and tuned specifically to *my* background with a hard geographic filter for PNW/remote.

The answer was a pipeline that mirrors how I actually think about job search: **collect wide**, **filter cheap**, **analyze on demand**, **act immediately** — no SaaS lock-in, no recurring cost beyond API tokens I already pay for, full control over the filter logic, the resume context, the analysis prompt, and the data.

{% image "./JIS-01-dashboard-overview.png", "Job Intelligence dashboard — 1,653 qualified candidates across 12,710 collected total, grouped by discovery day with source sidebar and tri-state filters" %}

## Multi-Source Collection

The collector orchestrates 15+ sources across three tiers, all configured in `config/config.yaml` — no code changes to add a new board. **Tier 1** covers curated ATS boards (Greenhouse, Lever, Ashby, SmartRecruiters) — clean JSON APIs, rich metadata, zero auth, hand-curated list of ~120 company boards that actually post design/engineering roles (Anthropic, Stripe, Figma, Linear, Notion, OpenAI, Cursor, Ramp). **Tier 2** is JobSpy's wide-net across LinkedIn, Indeed, Glassdoor, Google, and ZipRecruiter — 18 search queries × 3 sites × 40 results = up to 2,160 raw postings per run, pre-filtered by keywords like "product designer", "ux engineer", "design technologist", "ai product manager". **Tier 3** is remote-only public feeds (Remotive, RemoteOK, WorkingNomads, Web3Career) — no auth, full descriptions, gated downstream by the same title/location filter.

Every posting is keyed by URL (UNIQUE constraint in SQLite), with `recency_hours: 24` default so overnight re-runs only accumulate *new* postings. Polite pacing: `request_delay_seconds: 3.0` + `request_jitter_seconds: 2.0` + exponential backoff on 429s — designed to run safely every 3 hours without triggering rate limits.

## Filtering Without Data Loss

<div class="two-column">
{% image "./JIS-03-noise-filters-sidebar.png", "Noise filters panel — hardware/CAD, mechanical, architecture, footwear, game design all excluded by default with one-click reveal" %}
{% image "./JIS-04-dashboard-analyzed.png", "Dashboard with LLM fit scores — 85/100 for a strong match, 25/100 for a clear mismatch, verdict rendered inline on each card" %}
</div>

The stage-1 qualifier runs on *every* job in the DB, every daily run. Two-tier keyword logic in `config.yaml → match:` with `strong_any` (auto-qualify), `weak_any` (qualify only alongside a strong word), and `exclude_any` (hard drops). A geo gate enforces PNW/remote substrings — jobs with no location pass but are flagged `location_unknown` for review.

The broad "design" stem catches hardware/CAD, civil/architecture, footwear/apparel, game design — roles that are *not* digital product/UX/AI-interface work. Rather than hard-dropping these (destructive), each card gets tagged with its noise category and the dashboard exposes toggleable filters, pre-set to "exclude" by default. One click reveals them. Nothing deleted.

## On-Demand LLM Analysis

Clicking "⚡ Analyze fit" on any candidate card fires one `gpt-4o-mini` call via OpenRouter — full resume + job title, company, location, salary, employment type, and full description. Output is strict JSON: `fit_score` (0–100), `summary`, `strengths`, `concerns`, `talking_points`. Results are cached in the `evaluations` table; re-clicking is free. For LinkedIn cards where bulk description fetch gets rate-limited, lazy enrichment fires on the first Analyze click — one human-paced request, persisted, then analyzed.

{% image "./JIS-02-apply-page.png", "Apply page for a Senior Product Designer role at Medallion — fit score 85/100, strengths/concerns/talking points, generated cover letter, and ATS question scraping side-by-side" %}

## Dashboard & Apply Flow

`serve.py` is a single-file `ThreadingHTTPServer` (stdlib only, no Flask/FastAPI). The dashboard reads candidates live from DB, grouped by discovery day. Tri-state sidebar filters cycle neutral → include → exclude → neutral — real-time client-side filtering, no reload. Keyword chips on cards click to mirror the sidebar filter. Applied/Ignored toggles persist to DB instantly. An Import URL box accepts any job posting URL (Greenhouse, Lever, Ashby, LinkedIn, Indeed, company career page) — fetches, extracts, dedupes, qualifies, inserts as "Manual Addition".

The apply page (`/apply/<job_id>`) puts everything in one place: the cached fit verdict with color-coded score badge (green ≥75, yellow 55–74, red <55), a one-click cover letter generator that streams back a tailored letter, ATS question scraping for Greenhouse/Ashby URLs (extracts field labels, types, required flags, options, generates draft answers from resume context), and the full job description. Saved answers persist in `application_questions` for reuse across applications.

The project is designed to be forked and tuned for any background. The critical config is `match.strong_any`/`weak_any`/`exclude_any` in `config.yaml` — replacing these for your target roles takes about an hour. Point `config/resume.txt` at your own resume, tune `match.location_any` for your geography, curate the source boards for your target companies, run once, review the candidate list, iterate on keywords. Everything else is plumbing that just works.

## Reflection

The constraint that shaped this most: **tokens only on click**. It forced a clean separation between the free, repeatable collection/filter layer and the expensive analysis layer. That separation is the whole architecture — SQLite as the durable buffer, the dashboard as the query interface, the LLM as a just-in-time enrichment tool.

What worked: the two-tier keyword gate is surprisingly effective. Tuning `strong_any`/`weak_any` in YAML beats any ML classifier for precision/recall on a specific background. The noise filters solve the "design" stem problem without data loss. Lazy LinkedIn enrichment means no rate limits but full descriptions on demand.

What didn't: `serve.py` is a 1,700-line single file with embedded CSS/JS — `str.format()` means every `{`/`}` in the template must be doubled `{{`/`}}`. One missed brace breaks the whole page. The real fix is accepting a tiny template dependency (Jinja2) or extracting the HTML to a constant. The launchd plist took three tries to get right — `EnvironmentVariables` for PATH/VIRTUAL_ENV, `LimitLoadToSessionType` for Aqua+Background, `StandardOutPath`/`StandardErrorPath` for debugging. Documented in AGENTS.md so I don't relearn it.
