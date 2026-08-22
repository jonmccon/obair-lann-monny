---
title: Google Meet | UX Designer | Jonny McConnell
pageHeadline: Google Meet - Connection Pathways
description: Designed connection alternatives for Google Meet - a standalone desktop prototype during the Chrome Packaged Apps transition, and the web-to-phone dial-out feature that lets a phone participant join a meeting as a peer.
category: Google
bgColor: white
date: 2018-06-01
permalink: /design/google-meet-alternate-connections/
draft: false
featured: true
semiFeatured: true
thumbnail: /img/thumbnails/google-meet-thumb.jpg
tags:
  - ux
  - product
  - mobile
images:
- src: "./content/design/google-meet/goog-01.png"
- src: "./content/design/google-meet/goog-02.png"
- src: "./content/design/google-meet/goog-03.png"
- src: "./content/design/google-meet/goog-04.png"
- src: "./content/design/google-meet/goog-05.png"
- src: "./content/design/google-meet/goog-06.png"
chart:
  duration: 7
  collaboration: 85
  medium: 60
---

In 2018–2019, Google Meet was a browser tab. The goal was to make it feel like a product, a dedicated tool that worked for people with limited bandwidth, dedicated hardware, or no video at all. I worked on two separate bets toward that: a standalone desktop prototype that escaped the browser, and a phone dial-in feature that let your voice show up as a full meeting participant.

- **Role:** UX Designer
- **Company:** Google, G Suite, Hangouts Meet
- **Timeline:** 2018–2019
- **Team:** 12-person UX team dedicated to Meet; collaboration with the Material Design team
- **Platform:** Responsive Web, macOS, Windows, Android, Telephone (PSTN)
- **Tools:** Sketch, Chromium (prototype), Material Design system
- **Status:** Shipped, phone dial-out available on Google Workspace and Google One Premium accounts, standalone app shipped as Google Meet PWA (2021)

## The problem with the browser tab

In 2018, Google Meet ran inside a Chrome tab, and that created a real ceiling for enterprise G Suite customers. Dedicated conference rooms couldn't get hardware-enhanced performance. Users on constrained networks dropped from video calls. And phone participants? They showed up as a generic number in the participant list, disconnected from the meeting experience everyone else had.

The Hangouts Meet team wanted to explore two directions simultaneously: could Meet exist *outside* the browser as a first-class desktop experience? And could the product reach the people who weren't on a computer at all, calling in from a phone, connecting from infrastructure that didn't support [WebRTC](https://webrtc.org/)?

These weren't cosmetic improvements. The browser tab was a constraint at the architecture level. Solving it required working through how Chromium handled window management, media permissions, and app isolation, and on the phone side, how to design a handoff that felt seamless even when one participant's entire interface was a keypad.

## My role

The Meet team brought me in as a UX designer with focus on two separate problem areas. For the desktop prototype, I worked with the Kirkland engineering team to stress-test early standalone window models, forcing a Chromium branch to run Meet as an isolated instance outside the browser, exploring what the native interaction model should look like when you stripped away the address bar and typical controls.

For the phone dial-out feature, I owned the end-to-end UX design from the web-side initiation through the mobile receiver experience. I also collaborated with the Material Design team on early dark mode explorations that fed into what became the official Material dark theme specification.

## Escaping the browser

The problem with running Meet in a Chrome tab was everything that came with the tab: the address bar, the tab strip, the browser chrome that reminded you this was a webpage, not a dedicated application. Enterprise customers with meeting rooms wanted something that *felt* like a native product.

The Chromium developer community was actively working through this at the same time, phasing out legacy Chrome Packaged Apps, experimenting with `AppBrowserController` to strip away browser UI, and trying to figure out how to keep WebRTC media permissions persistent inside borderless windows.

The Kirkland prototype forced Meet to run as a standalone Chromium instance, no address bar, no tab strip, scoped camera and microphone permissions. The work wasn't about shipping a product directly; it was about proving the architecture was viable. What does it feel like when the app owns its window? What interaction patterns break when you remove browser affordances? What has to be designed from scratch?

The progression from browser tab → Chrome app → macOS window → dark standalone is visible in the explorations from that period. The dark mode work connected directly to a parallel conversation with Material Design about how their system should translate to non-browser surfaces, explorations that fed into the Material dark theme specification announced at Google I/O 2019.

Google Meet shipped as a [Progressive Web App in July 2021](https://support.google.com/meet/answer/10708569).

{% image "./goog-06.png", "The progression from Chrome tab to standalone app — each step removing another browser dependency." %}

## Making phone a first-class participant

The second problem was simpler to state but harder to design: how do you make a phone participant feel like a real meeting attendee?

At the time, calling into a Meet from a phone dropped you into the meeting as a phone number in the participant list. You were technically present, but the experience was brittle. The person on the phone had no way to know who else was there, what was happening, or whether they'd successfully joined. The web side had no visibility into the phone state. The two sides of the connection were islands.

The feature we designed, what shipped as Meet's dial-out capability, inverts the flow. Instead of the phone participant dialing in, the meeting *calls them*. From inside an active meeting, you enter a phone number; Meet places the call, the phone rings as a standard incoming call, and when they answer, the system announces the meeting context: *"Press 1 to join the meeting with 3 other participants."* On the web side, the phone participant shows up in the participant rail as a peer, not a ghost number, but a real presence in the meeting.

Designing the handoff required working both ends. On the web side: the initiation flow (Add people → Call tab → number entry → calling state → connected), the feedback loop as the call progresses, and how to show a phone participant who has no video feed inside a video-first layout. On the mobile side: what does it mean to receive a call from Hangouts Meet? What context does the lock screen give you? What does the in-call experience look like when you've joined a video meeting with your voice?

<div class="two-column">

{% image "./goog-01.png", "Google Meet home — the starting context. A scheduled meeting is one tap away." %}

{% image "./goog-02.png", "The dial-out initiation — \"Add people\" → CALL tab, phone number entry. The design makes phone dial-out a first-class action alongside email invite." %}

</div>

<div class="two-column">

{% image "./goog-03.png", "Calling state — the web participant sees real-time call progress while the meeting continues." %}

{% image "./goog-04.png", "The receive side on Android — an incoming call from Hangouts Meet with a contextual prompt: \"Press 1 to join the meeting with 3 other participants.\" The phone experience needed to be intelligible without any visual meeting context." %}

</div>

{% image "./goog-05.png", "Connected — the phone participant joins the participant rail as a peer. Both sides of the connection are now visible to each other." %}

## Outcomes

- Phone dial-out shipped; available on Google Workspace and Google One Premium accounts
- The standalone app prototype fed into the technical roadmap that culminated in the Google Meet PWA release (July 2021), now one of the top-3 most-used communication tools globally
- Dark mode explorations contributed to early Material dark theme work, formally specified at Google I/O 2019 and now referenced in accessibility and design standards

## Reflection

Looking back, I underestimated how significant the timing was. In 2018, I was focused on the immediate UX problems, what does dial-out feel like, how does a standalone app behave, and navigating the pressure around these interactions pushing outside Google's primary interaction surface. I didn't have a full view of where the Chromium community was taking PWAs, or that the dark mode work would become a specification. The work felt like careful, incremental problem solving at the time. In context, it was right in the middle of a platform-level shift.

What I'd do differently: I'd document the constraints more explicitly as we went. The engineering decisions (AppBrowserController, WebRTC sandboxing, persistent media permissions) shaped the design in ways that are hard to reconstruct now. The design decisions make sense in the context of what was architecturally possible and what wasn't.

<!-- PREVIOUS BODY (backed up from pre-migration stub):
[] probably rewrite this

The Hangouts Meet team was interested in prototyping connection alternatives to better serve customers with infrastructure limitations and explore hardware enhanced performance. My role was two-fold, one in helping to prototype a downloadable Windows & Mac adaptation of the existing webapp. 
Collaborated with the Material team to discuss appropriate translations of interaction language outside of the browser. Including early visual explorations of dark mode.
-
Secondly, in designing a more robust web-to-phone connection that lives online. So that you & your voice show up as the same participant. 
-
Available on Google

https://design.google/
https://material.io/design
https://material.io/design/color/dark-theme.
https://support.google.com/meet/answer/9518557
https://apps.google.com/meet/
-->
