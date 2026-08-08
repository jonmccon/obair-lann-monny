---
title: Product Designer | Providence Healthcare | Jonny McConnell
pageHeadline: Providence Telestroke & Express Care
description: End-to-end UX for a real-time telestroke platform and a multi-product Express Care scheduling suite, where design decisions carried direct clinical stakes.
category: Providence
date: 2018-05-01
permalink: /design/providence-telestroke-platform/
draft: false
featured: true
semiFeatured: true
thumbnail: /img/thumbnails/providence-thumb.png
tags:
  - ux
  - product
  - healthcare
images:
  - src: "./content/design/providence/prov-01.png"
  - src: "./content/design/providence/prov-02.png"
  - src: "./content/design/providence/prov-03.png"
  - src: "./content/design/providence/prov-11.png"
  - src: "./content/design/providence/prov-17.png"
  - src: "./content/design/providence/prov-29.png"
  - src: "./content/design/providence/prov-06.png"
  - src: "./content/design/providence/prov-05.png"
  - src: "./content/design/providence/prov-20.png"
  - src: "./content/design/providence/prov-21.png"
  - src: "./content/design/providence/prov-07.png"
  - src: "./content/design/providence/prov-08.png"
  - src: "./content/design/providence/prov-09.png"
  - src: "./content/design/providence/prov-10.png"
  - src: "./content/design/providence/prov-04.png"
  - src: "./content/design/providence/prov-13.png"
  - src: "./content/design/providence/prov-12.png"
  - src: "./content/design/providence/prov-25.png"
  - src: "./content/design/providence/prov-26.png"
  - src: "./content/design/providence/prov-28.jpg"
  - src: "./content/design/providence/prov-27.jpg"
  - src: "./content/design/providence/prov-30.jpg"
  - src: "./content/design/providence/prov-31.jpg"
  - src: "./content/design/providence/prov-32.jpg"
  - src: "./content/design/providence/prov-16.png"
---

Designing high-stakes clinical workflows for on-demand emergency care. From a real-time telestroke platform with remote diagnostic hardware to a multi-product Express Care scheduling suite used by patients across Providence's network.

- **Role:** Product Designer
- **Company:** Providence Health & Services, Digital Innovation Group
- **Timeline:** 2017–2018
- **Platform:** Web, iOS, Android
- **Tools:** Sketch, InVision (Craft), Zeplin, Abstract, Adobe Creative Cloud, Storybook, React Toolbox, Source Sans Pro

## The Problem

Providence's Digital Innovation Group was building two distinct healthcare products simultaneously, each with fundamentally different users and stakes. On one side: emergency clinicians managing time-critical stroke alerts across a distributed hospital network, switching between four separate systems during a patient handoff, every second of context-switching a clinical risk. On the other: patients trying to navigate between four separate care services (Urgent Care, Virtual, Primary, Same-Day) that had no shared scheduling layer, no common identity, and no consistent experience.

The existing tools had been built for billing and back-office workflows. Neither was designed for how clinical staff actually worked under pressure, or for patients making care decisions in moments of stress or uncertainty.

## My Role

Providence's Digital Innovation Group brought me in as a product designer with a dual mandate: design the clinical workflows for a new video-based emergency care platform, and rearchitect four existing care services into a unified scheduling and marketing suite with a shared multitenant architecture. I worked with [Sunny Lee](https://www.linkedin.com/in/sunnyleedesign/) and [Kelly Elston](https://www.linkedin.com/in/kellyelston/) on the research and service design phases across both products, and led visual design and interaction design from early wireframes through the Storybook component library. My contribution spanned discovery research, service design, interaction design, design system development, and engineering collaboration through to production.

## Telestroke Platform

Providence needed an on-demand emergency room video call platform that could handle remote diagnostic instruments (cameras, handheld [JedMed](https://www.jedmed.com/) tools, and hardware mounted on carts) alongside a live patient record pulled from the medical database [Epic](https://www.epic.com/). The clinical UX challenge was significant: providers rarely looked at a screen during the critical first minutes of a telestroke consult. They used the interface as a reference *after* the initial assessment. Observing clinical staff during actual patient handoffs revealed this early and it inverted our original information hierarchy. We moved the patient vitals and NIH Stroke Scale tool from a secondary panel into the primary video overlay where they could be scanned peripherally, not hunted for.

After partnering with Sunny Lee and Kelly Elston to research Providence's established caregiver process, protocol, and hardware, we designed and tested service workflows and case management tools. The result was a platform that put patient context exactly where a clinician's attention already was.

{% image "./prov-01.png", "Provider view of the video service from a cart situated in a patient's room. Clockwise from the top left: Patient information card with NIH Stroke Scale tool, provider account, audio/video controls, remote camera controls, saved XYZ view positions, self view, on-cart tool controls." %}

{% image "./prov-02.png", "Example of switching to the handheld JedMed video tools. The UI had to remain legible with a provider's attention split between the instrument and the patient." %}

{% image "./prov-03.png", "Telestroke dashboard for centralized management of session requests and hardware connectivity with partial Epic API integration for patient records." %}

{% image "./prov-29.png", "Progression of screens for a hardware diagnostic system. During an onsite research session a nurse described their training for medical hardware: as soon as a tool wasn't working, there was no time for diagnostics — just move on to the next procedural step. This helped us rework a technician-led diagnostic tool to instead run automatically on the platform side, checking its own status and reporting to an IT lead." %}

## Express Care Suite

A quartet of established care services, Urgent Care, Virtual Care, Primary Care, and Same-Day Care, were rearchitected as a suite of Express Care options and brought together on a shared marketing and scheduling platform with a multitenant architecture. The user problem: patients experiencing a non-emergency health issue faced four separate websites, four separate scheduling systems, and no guidance on which type of care they actually needed.

The design challenge was building one shared experience that could surface the right care option for a patient's specific situation: handling symptom triage, insurance coverage and cost transparency, appointment selection, and registration across four distinct service contexts and multiple Providence locations.

{% image "./prov-06.png", "A clinic location page with appointment time selection, symptom triage, insurance coverage and costs." %}

{% image "./prov-05.png", "Custom skin for the prototype dashboard (patient detail view) built on Salesforce." %}

<div class="two-column">

{% image "./prov-20.png", "Patient registration — dark theme, multi tenant. The form handled family registration while maintaining Epic record-matching accuracy." %}

{% image "./prov-21.png", "The same registration flow in light theme, multi tenant. Material's theming system let us adapt to different care contexts without rebuilding components." %}

</div>

<div class="two-column">

{% image "./prov-07.png", "An example of different form states used throughout the paperwork sections." %}

{% image "./prov-08.png", "Material's card-based structure imposed on the sign-up forms." %}

{% image "./prov-09.png", "Toast and status bar error states." %}

{% image "./prov-10.png", "Progress indicators and success states imposed to clarify user actions." %}

</div>

## Modifying Material for Healthcare

Material Design out of the box felt too clinical for healthcare, too cold for a platform where both patients and caregivers were under stress. We warmed it systematically: Source Sans Pro for its humanistic feel, increased corner radii, expanded padding throughout. Those weren't aesthetic choices, they were empathy decisions, backed by feedback from users who described the default Material feel as "like a database."

The system was grounded in a 960px wide 12-column structure and 16px baseline grid. Material's theming architecture let us maintain visual consistency across multiple Providence brand applications, including a dark theme for the telestroke clinical context and lighter variants for patient-facing Express Care screens, from a single component set.

The engineering collaboration was built directly into the workflow. Working with the team in Storybook, taking React Toolbox and subbing in custom typography, rounded corners, and opened-up styles, meant interaction patterns migrated into components without a handoff gap. Design decisions stayed intact through to production.

<div class="two-column">

{% image "./prov-04.png", "Design language applied to a provider's detail view." %}

{% image "./prov-13.png", "Leveraged Material's mentality for simple theming variations and a single type choice. A 960px wide 12-column structure and 16px baseline grid formed the basis of the Material modifications." %}

</div>

{% image "./prov-12.png", "A prototype user flow, as seen in Sketch + InVision's Craft prototyping method." %}

## Research & Wireframes

<div class="two-column">

{% image "./prov-25.png", "Collaborated with Sunny Lee to help develop a mapped-out user flow." %}

{% image "./prov-26.png", "Collaborated with Sunny Lee to accommodate native apps interacting with web services." %}

</div>

<div class="two-column">

{% image "./prov-28.jpg", "Collaborated with Sunny Lee on administrative dashboard wireframes. Many iterations until we ended up with something that helped the staff and didn't add daily stress." %}

{% image "./prov-27.jpg", "Collaborated with Sunny Lee to develop mobile wireframes for video visits." %}

</div>

<div class="three-column">

{% image "./prov-30.jpg", "Express Care scheduling flow wireframes, early IA and navigation structure." %}

{% image "./prov-31.jpg", "Registration and account management wireframe review, iterating on form structure and step sequencing." %}

{% image "./prov-32.jpg", "Scheduling and intake wireframes, symptom triage and insurance coverage flows." %}

</div>

## Outcome

The telestroke platform launched as Providence's on-demand emergency video service, integrating with Epic for live patient record access during active sessions. The Express Care suite consolidated four separate scheduling experiences onto a shared multitenant platform, reducing friction for patients navigating between Urgent Care, Virtual, Primary, and Same-Day appointment types.

The design system established during this engagement, Material-based with healthcare-specific modificationsm was adopted by subsequent product teams within the Digital Innovation Group. Working directly in Storybook with engineering meant components shipped with design intent intact, without a separate handoff cycle.

<!-- PREVIOUS BODY (backed up from pre-migration stub):

Providence & Swedish
Making healthcare a little easier

My time with Providence Health & Services' Digital Innovation Group focused on two distinct digital product categories. First, designing an on-demand emergency room video call platform with remote diagnostic instruments. After partnering with Sunny Lee & Kelly Elston to research Providence's established caregiver process, protocol, and hardware we designed and tested service workflows and case management tools.  Secondly, a quartet of established care services were rearchitected as a suite of Express Care options and brought together on a shared marketing & scheduling platform with a multitenant architecture.
-
I also helped develop a visual language for the suite of provider & patient healthcare tools. A team process of leveraging Abstract (git), Sketch (layout), Invision (public prototyping), Zeplin (internal prototyping), along with the Adobe Creative Cloud (production). The visual design system was based on Google's Material language, but out of the box it felt too cold for the healthcare world. After partnering with engineering, we developed a solution of taking React Toolbox and subbing in a humanistic typeface, rounded some corners and generally opened up the vanilla styles (more padding). By working with these tools, we were able to more fluently migrate interaction & visual work into React components via direct collaboration in Storybook.

[Raw URLs and image blocks from old stub omitted]

-->
