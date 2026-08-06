---
title: "Lumedic Health Records | Product Designer | Jonny McConnell"
description: "Designing trust flows for patient-held medical records — from digital health wallet to COVID-19 vaccine passport, shipped across iOS, Android, and web for the Providence Health network."
category: Lumedic
bgColor: gray
date: 2021-01-01
draft: false
featured: false
semiFeatured: false
thumbnail: /img/thumbnails/lumedic-thumb.png
tags:
  - ux
  - product
  - healthcare
  - mobile
images:
- src: "./content/design/Lumedic/lum-10.png"
- src: "./content/design/Lumedic/lum-20.png"
- src: "./content/design/Lumedic/lum-30.png"
- src: "./content/design/Lumedic/lum-40.png"
- src: "./content/design/Lumedic/lum-55.png"
- src: "./content/design/Lumedic/lum-70.png"
- src: "./content/design/Lumedic/lum-80.png"
- src: "./content/design/Lumedic/lum-90.png"
- src: "./content/design/Lumedic/lum-110.png"
- src: "./content/design/Lumedic/lum-120.png"
- src: "./content/design/Lumedic/lum-130.png"
---

In early 2020, tens of thousands of hospital employees needed a way to prove their COVID-19 status to get into work and no trustworthy, patient-controlled system existed to do it. I designed the multiplatform experience that filled that gap: a digital health wallet letting patients hold and share their own verified medical records, used across iOS, Android, and web within the Providence Health network.

**Role:** Product Designer · **Company:** Lumedic, a Providence St. Joseph Health portfolio company · **Timeline:** 2019–2021 · **Team:** Primary designer on this platform within a 5-person design team · **Platform:** Web, iOS, Android · **Tools:** Figma, Miro, IBM Carbon Design System · **Status:** Shipped — previously available on App Store and Google Play

Medical records are controlled by healthcare systems for good reason. FHIR-compliant APIs live behind institutional firewalls, accessible only to licensed staff at licensed facilities. Patients are not parties to their own records. That architecture works for billing and clinical workflow, but it breaks entirely when a hospital employee needs to prove their vaccination status to enter a facility at 6am.

Lumedic's platform inverted this model: the patient becomes a trusted holder of their own verified credentials, able to share selectively with authorized parties. The design challenge wasn't the cryptography — it was building an experience that made that trust transfer feel obvious, safe, and fast to people who had no reason to understand what was happening underneath.

The problem evolved in real time. What began as a general health wallet in 2019 became a COVID-19 testing passport in spring 2020 and then expanded to vaccine status as the science changed. Every release required us to adapt the IA and the interaction model alongside the regulatory and political landscape.

{% image "./lum-20.png", "Early caregiver user flow mapping the COVID research & testing journey — from email outreach through onsite blood draw to MyChart results." %}

Lumedic brought me in as the primary product designer on the patient-facing wallet app. I owned the end-to-end design across all three releases: from the initial UX audit of the boilerplate wallet, through the multimodal architecture, to the final Carbon-based design system adaptation. I worked directly with research partner [Jeanine Ledoux](https://www.linkedin.com/in/jeanineledoux/) on user testing, collaborated closely with engineering to spec interactions, and partnered with Seattle studio Smashing Ideas on the custom illustration system. The broader design team of five was focused on other parts of the company platform — the patient wallet was mine to ship.

## Release 1: Establishing a Foundation

The first release started with an audit. The boilerplate was a digital wallet from Evernym, an existing "Holder & Verifier handshake" infrastructure built for self-sovereign identity. My job was to understand every screen, identify what needed to be reskinned vs. redesigned, and ship something trustworthy to the App Store fast enough to matter.

I worked screenshot by screenshot through the onboarding, authentication, and credential flows, annotating what was confusing, what was honest, and what was just ugly. The goal wasn't a beautiful app — it was a working foundation with enough trust signal to get users through setup and into their first credential.

{% image "./lum-30.png", "Release 1 UX audit — the Evernym boilerplate onboarding flow with Lumedic reskinning notes, annotated from splash through wallet setup and first credential receipt." %}

We shipped to the App Store. That meant we had something real to test with real users, which is what the second release actually needed.

## Release 2: The Multimodal Architecture

The second release is where the product got genuinely hard. We were designing a trust handshake that could happen across multiple surfaces simultaneously: a patient's phone sharing credentials with a hospital's desktop kiosk via QR code; a verifier's device scanning a holder's device; two phones scanning each other. Each scenario had a different set of mental models, permission states, and failure modes.

[Jeanine Ledoux](https://www.linkedin.com/in/jeanineledoux/) and I ran user research with hospital employees to test how much context people actually needed — and how much they resisted. The findings were clarifying: users didn't need to understand the credential system. They needed to understand the outcome. "Scan this and they'll see your vaccination record" was enough. Every layer of explanation beneath that was noise that eroded trust rather than building it.

That insight restructured the permission flows. We stripped back the onboarding copy, removed the technical explanations, and made the verification moment as kinetic and obvious as possible: point phone, scan QR, wait for green.

{% image "./lum-40.png", "Holder–Verifier–Issuer architecture diagram and core flow map — the three-party trust model showing how patients, hospital verifiers, and medical issuers interacted across the platform." %}

<div class="two-column">

{% image "./lum-55.png", "Multimodal wireframe explorations — testing QR scan interactions, share flows, and wallet IA across phone-to-phone and phone-to-desktop scenarios." %}

{% image "./lum-70.png", "Navigation architecture explorations — multiple IA models tested for the wallet home, scan, and catalog flows before landing on the final structure." %}

</div>

## Release 3: Design System & Scale

The third release gave us space to do the work properly. With a functional foundation and validated interaction model, I focused on adapting [IBM's Carbon Design System](https://www.carbondesignsystem.com/) to iOS and Android, bridging Carbon's desktop/web origins to native mobile patterns without losing the system's structural integrity.

This meant defining which Carbon components translated directly to mobile, which needed modification, and which needed to be built from scratch within the system's visual language. I worked in Figma to build the adapted mobile component library, documenting behavior and states for engineering handoff.

Custom illustration was developed in parallel with Seattle studio Smashing Ideas, a deliberate choice to give the app a warmer, more human register than the clinical platform it was tethered to.

<div class="two-column">

{% image "./lum-10.png", "Shipped iOS and Android screens — the Lumedic Connect app showing COVID-19 vaccine record card, QR scan connection flow, and credential detail view with Providence Health branding." %}

{% image "./lum-110.png", "Verifier kiosk web interface — the Lumedic Connect verification kiosk for hospital staff, showing the QR code display waiting for employee scan." %}

</div>

<div class="two-column">

{% image "./lum-120.png", "Verifier kiosk — active state with \"Waiting for record holder to share information\" banner while QR code is being scanned." %}

{% image "./lum-130.png", "Verifier kiosk — successful verification state, showing patient COVID-19 test result confirmed negative." %}

</div>

## Issuer Side

The patient wallet was only half the system. Hospital administrators and clinic staff needed a separate web interface to create, batch-upload, and issue credentials — the Issuer Dashboard. I designed the CSV bulk upload flow for administering vaccine records at facility scale, including error validation states for malformed rows.

<div class="two-column">

{% image "./lum-80.png", "Lumedic Connect Issuer Dashboard — COVID-19 vaccine record creation form for individual and bulk CSV upload with validation." %}

{% image "./lum-90.png", "Issuer Dashboard — bulk upload error state, showing row-level validation errors returned from the system before records are committed." %}

</div>

This surface had a different user than the patient wallet — it was designed for clinic coordinators managing hundreds of records, not patients managing their own handful. The error states were the critical design challenge: what does a non-technical healthcare administrator do when row 234 has an invalid vaccine serial? The answer had to be immediate, specific, and actionable.

## Outcome

Launched to employees across clinics, hospitals, and facilities throughout the Providence Health network. Tens of thousands of healthcare workers used Lumedic Connect to demonstrate vaccination and testing status during the height of the pandemic, allowing them to continue working safely in their communities.

The platform also contributed to a broader industry initiative on digital health identity standards, building on W3C and Trust Over IP (ToIP) frameworks.

- [Pacific Medical Centers Pilot Program with Lumedic Connect](https://www.pacificmedicalcenters.org/news/pacmed-pilots-lumedic-for-vaccine-records-on-your-phone/)
- [U.S.-based health alliance to develop open standards for secure exchange of health information](https://www.cambiahealth.com/news-and-stories/news-releases/lumedic-exchange-advance-digital-identity-standards-give-patients)
- [Providence St. Joseph Health Acquires Lumedic](https://blog.providence.org/blog/providence-st-joseph-health-acquires-lumedic-to-transform-health-care-revenue-cycle-management)
- [Can blockchain heal what ails healthcare? Lumedic launches new quest for digital identity standards](https://www.geekwire.com/2020/can-blockchain-heal-ails-healthcare-lumedic-launches-new-quest-digital-identity-standards/)

## Reflection

The most durable design lesson from this project came from language, not layout. In early testing, we included explanations of how the verification system worked: the credential exchange, the trust handshake, the fact that nothing was stored centrally. We thought transparency would build trust.

It didn't. Users didn't want to understand the system. They wanted to trust the people who built it, and they trusted those people because their employer had sanctioned the app. What they needed from us wasn't technical honesty — it was clarity about what to do and what would happen. We dropped the word "blockchain" entirely. We dropped most of the explanatory copy. The interface got simpler, and trust went up.

For enterprise deployments — onboarding partner organizations, getting IT sign-off, walking hospital administrators through data governance — we did need to explain the architecture. But that audience came with a different baseline. The design insight was knowing which audience was in front of you and giving them exactly what that moment required: action and confidence for the patient, detail and control for the administrator.

<!-- PREVIOUS BODY (backed up from pre-migration stub):
Covid-19 Passport
Medical records on the blockchain

I spent most of 2020 looking at opportunities to help the general public navigate the public health crisis. Lumedic, a Providence portfolio company, had an existing broad use medical-record-on-blockchain technology that we pivoted to serve as a single use digital passport. Our product planning & research followed as the science & politics evolved throughout the year, first as a time oriented test result passport and eventually also containing vaccine status card.  
-
The app was originally based on an existing structure from Connect.me that we audited from a user experience pov with the goal of creating a Holder & Verifier handshake scenario. My work centered around architecting the multimodal experience of permissions, mobile devices scanning QR codes on desktop web apps, and on each other's devices, working with user expectations and building prototypes with my UX Research partner Jeanine Ledoux. In addition to serving as the daily scrum designer for the web app and both iOS & Android releases. 
-
Wireframing was done in Miro and Figma. The visual branding work was built on top of IBM's Carbon design system. Illustrations by Smashing Ideas.
-
Available on iOS & Android

https://www.lumedic.io/
https://connect.me/
https://www.linkedin.com/in/jeanineledoux/
https://www.carbondesignsystem.com/
https://apps.apple.com/us/app/lumedic-connect/id1519412921
https://play.google.com/store/apps/details?id=io.lumedicidconnect.lumedicid
-->
