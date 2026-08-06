---
title: PwC — Concourse
description: As the sole designer on the responsive workstream, I brought PwC's internal consulting platform to mobile — designing the full experience from login through project delivery while extending the enterprise design system with touch-adapted patterns adopted across all mobile product work at PwC. Change management is a design problem, and this project proved it.
category: pwc
date: 2021-01-01
thumbnail: /img/thumbnails/pwc-thumb.png
draft: false
featured: false
semiFeatured: false
tags:
  - ux
  - product
  - mobile
  - design-systems
images:
- src: "./content/design/pwc/PWC-24-responsive-homepage-1440px.png"
- src: "./content/design/pwc/PWC-18-responsive-dashboard-1440px.png"
- src: "./content/design/pwc/PWC-21-responsive-deliverables-1440px.png"
- src: "./content/design/pwc/PWC-20-responsive-dashboard-mobile.png"
- src: "./content/design/pwc/PWC-19-responsive-dashboard-mobile-menu.png"
- src: "./content/design/pwc/PWC-23-responsive-deliverables-mobile.png"
- src: "./content/design/pwc/PWC-22-responsive-deliverables-mobile-menu.png"
- src: "./content/design/pwc/PWC-26-responsive-homepage-mobile.png"
- src: "./content/design/pwc/PWC-25-responsive-homepage-mobile-menu.png"
- src: "./content/design/pwc/PWC-11-mobile-40-home.png"
- src: "./content/design/pwc/PWC-15-mobile-80-workspace.png"
- src: "./content/design/pwc/PWC-14-mobile-70-notifications.png"
- src: "./content/design/pwc/PWC-12-mobile-50-expanded-overdue.png"
- src: "./content/design/pwc/PWC-16-mobile-90-overdue-filter.png"
- src: "./content/design/pwc/PWC-13-mobile-60-menu.png"
- src: "./content/design/pwc/PWC-02-mobile-100-filters.png"
- src: "./content/design/pwc/PWC-03-mobile-110-people.png"
- src: "./content/design/pwc/PWC-05-mobile-120-work-item-detail.png"
- src: "./content/design/pwc/PWC-06-mobile-120-work-item-status.png"
- src: "./content/design/pwc/PWC-04-mobile-110-work-item-expanded.png"
- src: "./content/design/pwc/PWC-07-mobile-130-work-item-menu.png"
- src: "./content/design/pwc/PWC-08-mobile-140-document.png"
- src: "./content/design/pwc/PWC-01-mobile-10-login.png"
- src: "./content/design/pwc/PWC-10-mobile-30-login-success.png"
---

Designed the responsive web experience for Concourse, PwC's internal platform for managing consulting engagements. As the sole designer on this workstream, I extended a desktop-first enterprise tool into a fully responsive web application, covering mobile through large desktop. The work touched login flows, the home workspace overview, a multi-view deliverables system, dashboard analytics, files, digital assets, tools, and reports — and produced a suite of touch-adapted design system components that were adopted across all mobile work at PwC.

**Role:** Senior UX Designer · **Company:** PwC (PricewaterhouseCoopers) · **Timeline:** 2021–2023 · **Team:** 12-person design team across platform and design system capacities · **Platform:** Responsive Web (mobile through 1900px) · **Tools:** Figma, React (web), Storybook · **Status:** Internal only, NDA

## The Problem

Every PwC office had its own way of running consulting projects. That independence made sense locally but it created friction the moment a project crossed borders or business units. There was no shared language for scope, timeline, or delivery status. Resources couldn't be onboarded without teaching them a new process. The same work was being duplicated across offices that couldn't see each other's output.

Concourse was PwC's answer: a single platform to standardize how engagements were structured, tracked, and reported without flattening how individual offices actually worked. The first release shipped desktop only. My job was to break it open.

The access model added its own constraints. This wasn't a public product — it lived behind the company VPN on managed devices, with IT as a gatekeeper for non-managed access. Every screen needed to carry robust permission logic: what you could see, edit, comment on, or approve depended on your role, your office, and where you were in a project lifecycle. Localization for international offices layered on top of that. These weren't edge cases, they were the product.

## Scope

I was the sole designer dedicated to the responsive build, working directly with a product owner on research and requirements, and with two design system designers on component adaptation. The scope covered discovery research across US and British offices, user flow documentation for the full engagement lifecycle, wireframing and high-fidelity prototype development, and touch-adapted design system contributions including new components, cross-platform modifications, and mobile-first interaction patterns.

The design system work was particularly significant. The existing system was built desktop-first and web-only. Extending it to mobile touch required thinking through how every interaction pattern changed — tap targets, swipe gestures, navigation hierarchies, information density, and the loss of hover states. These contributions didn't just serve Concourse. They became the baseline for all mobile work across PwC's internal product ecosystem.

## Research & Direction

I started by mapping when a consultant would actually want to reach for their phone. Not in the abstract but in the specific, inconvenient moments. In a cab between client sites. At a client's office on a non-PwC network. Under a deadline, needing to push a comment on a document without opening a laptop.

The answers shaped the priority stack. Consultants didn't need to author complex project plans on mobile. They needed to catch up on status changes, surface overdue items, respond to comments, approve documents, and understand where a project stood — fast. That's a read-heavy, action-light use case, with a small set of high-value write operations layered in.

Through interviews across multiple regional offices, we hit a pattern we hadn't expected: there wasn't a strong desire to standardize at the individual working level. People liked how their office did things. What we found we *could* standardize — and where teams saw clear value — was the structural spine of an engagement: how work was organized, how status flowed upward, how reporting looked the same whether it came from London or Chicago.

That finding unlocked the design direction. The mobile experience wasn't trying to replicate the full desktop platform; it was surfacing that structural spine in a form that worked in motion, on any device, without a managed machine. The prototype shipped to US and British offices. Feedback loops ran back through the product owner. What we built wasn't just a smaller version of the desktop — it was a deliberately scoped, fast-access layer that made the platform usable in the moments when a laptop wasn't.

## Outcomes

**Responsive web experience** shipped across mobile, tablet (portrait + landscape), and large desktop (1440px–1900px). **Design system extended** with touch-adapted patterns, new components, cross-platform modifications, and mobile-first interaction patterns — adopted as the baseline for all mobile product work across PwC's internal ecosystem. **Mobile prototype deployed** to US and British offices for user testing. Login flow, home workspace, dashboard, deliverables, files, digital assets, tools, and reports all fully responsive. Work item detail model with real-time commenting, file attachments, checklists, tasks, and subtasks, fully functional on mobile. Permission-aware UI model established for role-based access states across the engagement lifecycle.

## Reflection

The decision to build a responsive web application instead of native iOS/Android was the right call: more features, faster to ship, easier to maintain, no app store gate. But it's not as immediately impressive to stakeholders as handing someone a native app. There's a real politics to that in enterprise work. The visible artifact matters to adoption, not just the quality of the experience underneath.

The other thing I'd carry forward: change management is a design problem. You're not just designing screens, you're designing the conditions under which people will actually change how they work. In an organization like PwC, where every office has its own muscle memory, the friction isn't technical. It's about trust and timing. The teams that embraced the platform did so because they felt ownership over how it fit into their process — not because it was mandated.

---

**Responsive Web — Desktop (1440px)**

<div class="two-column">
{% image "./content/design/pwc/PWC-24-responsive-homepage-1440px.png", "Home — Workspace Overview at 1440px" %}
{% image "./content/design/pwc/PWC-18-responsive-dashboard-1440px.png", "Dashboard — Work Items and Analytics at 1440px" %}
</div>

{% image "./content/design/pwc/PWC-21-responsive-deliverables-1440px.png", "Deliverables — List, Gantt, and Board views at 1440px" %}

---

**Responsive Web — Mobile**

<div class="three-column">
{% image "./content/design/pwc/PWC-20-responsive-dashboard-mobile.png", "Dashboard Mobile" %}
{% image "./content/design/pwc/PWC-19-responsive-dashboard-mobile-menu.png", "Dashboard Mobile — Nav Menu Open" %}
{% image "./content/design/pwc/PWC-23-responsive-deliverables-mobile.png", "Deliverables Mobile" %}
</div>

<div class="three-column">
{% image "./content/design/pwc/PWC-22-responsive-deliverables-mobile-menu.png", "Deliverables Mobile — Menu Open" %}
{% image "./content/design/pwc/PWC-26-responsive-homepage-mobile.png", "Home Mobile" %}
{% image "./content/design/pwc/PWC-25-responsive-homepage-mobile-menu.png", "Home Mobile — Menu Open" %}
</div>

---

**Mobile Prototype**

<div class="three-column">
{% image "./content/design/pwc/PWC-11-mobile-40-home.png", "Home — My Workspaces" %}
{% image "./content/design/pwc/PWC-15-mobile-80-workspace.png", "Workspace / Project Overview" %}
{% image "./content/design/pwc/PWC-14-mobile-70-notifications.png", "Notifications" %}
</div>

<div class="three-column">
{% image "./content/design/pwc/PWC-12-mobile-50-expanded-overdue.png", "Expanded Overdue Items" %}
{% image "./content/design/pwc/PWC-16-mobile-90-overdue-filter.png", "Overdue Filter" %}
{% image "./content/design/pwc/PWC-13-mobile-60-menu.png", "Navigation Menu" %}
</div>

<div class="three-column">
{% image "./content/design/pwc/PWC-02-mobile-100-filters.png", "Filters" %}
{% image "./content/design/pwc/PWC-03-mobile-110-people.png", "People / Team View" %}
{% image "./content/design/pwc/PWC-05-mobile-120-work-item-detail.png", "Work Item Detail" %}
</div>

<div class="three-column">
{% image "./content/design/pwc/PWC-06-mobile-120-work-item-status.png", "Work Item Status Panel" %}
{% image "./content/design/pwc/PWC-04-mobile-110-work-item-expanded.png", "Work Item Detail — Expanded" %}
{% image "./content/design/pwc/PWC-07-mobile-130-work-item-menu.png", "Work Item Context Menu" %}
</div>

<div class="three-column">
{% image "./content/design/pwc/PWC-08-mobile-140-document.png", "Document Detail View" %}
{% image "./content/design/pwc/PWC-01-mobile-10-login.png", "Login Step 1" %}
{% image "./content/design/pwc/PWC-10-mobile-30-login-success.png", "Login Success" %}
</div>
