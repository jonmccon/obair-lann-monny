---
title: PTR Business Card Maker | Tool Design | Jonny McConnell
pageHeadline: PTR Business Card Maker
description: A browser-based business card configurator built for Priority Tax Relief. Staff type their contact details, pick a color theme, and download print-ready bleed-correct PDFs in under two minutes — no designer required.
date: 2024-06-01
permalink: /design/ptr-card-maker/
draft: false
featured: false
semiFeatured: true
thumbnail: /img/thumbnails/ptr-card-maker-thumb.png
tags:
  - branding
  - identity
  - tool
  - print
  - web
images:
  - src: ./content/design/ptr-card-maker/PTRCM-01-ink.png
    alt: PTR Business Card Maker — Ink theme, Morgan Kestrel, Creative Director
  - src: ./content/design/ptr-card-maker/PTRCM-02-ptr-green.png
    alt: PTR Business Card Maker — PTR Green theme, Rafael Duran, Senior Tax Advisor
  - src: ./content/design/ptr-card-maker/PTRCM-03-orange.png
    alt: PTR Business Card Maker — Orange theme, Diane Holloway, Client Relations Manager
---

A browser-based business card generator built for Priority Tax Relief. Staff fill in a simple form, pick a color theme, and download two bleed-correct PDFs ready to upload directly to Vistaprint — no design software, no designer in the loop.

**Role:** Designer & Developer (solo) · **Project:** Priority Tax Relief (internal tool) · **Platform:** GitHub Pages · **Status:** 🟢 Live

## The Problem

PTR onboards new staff regularly. Each time, someone had to track down a designer, regenerate the card files, and wait for a handoff before placing an order. The process introduced lag and a bottleneck that didn't need to exist — the cards follow a fixed brand system, only the contact details change.

## The Tool

The configurator presents a clean form: name (wraps to two lines automatically), title, phone, optional extension and second line, email, and website. A live card preview updates as you type. When ready, two buttons download the front and back as separate PDFs — each at 3.62 × 2.12 in with 0.06 in bleed on all sides and an embedded trim box, so Vistaprint centers the artwork automatically on cut.

{% image "./PTRCM-01-ink.png", "PTR Business Card Maker — Ink theme (black front, white back)" %}

## Color Themes

Twelve brand-approved themes cover the full range from the original Ink (black front, white back) to PTR Green, Bone, Orange, and several off-guide variants. Staff pick from the palette — no free-form color entry, no way to go off-brand by accident.

<div class="two-column">
{% image "./PTRCM-02-ptr-green.png", "PTR Green theme — front and back card preview" %}
{% image "./PTRCM-03-orange.png", "Orange theme — front and back card preview" %}
</div>

## Technical Notes

The tool is entirely client-side JavaScript — no backend, no server, no data sent anywhere. PDF generation runs in the browser. Hosted on GitHub Pages means zero infrastructure to maintain and zero ongoing cost. Output files carry a trim box so the card artwork lands centered once cut, with no extra scaling or margin step required at the printer.

## Outcome

An office manager can generate and order a business card for a new hire in under two minutes with no file handoff. The designer bottleneck is gone.
