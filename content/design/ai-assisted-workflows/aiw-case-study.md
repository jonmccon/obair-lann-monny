---
title: AI Assisted Workflows | Product Designer | Jonny McConnell
pageHeadline: AI Assisted Workflows
description: How I use AI as a collaborative partner across research synthesis, spec writing, rapid prototyping, and design system development - showing the actual setup with Gemini, Claude, Hermes, and Figma MCP.
category: AI Assisted Workflows
bgColor: black
date: 2025-01-01
permalink: /design/ai-assisted-workflows/
draft: false
featured: true
semiFeatured: true
thumbnail: /img/thumbnails/ai-assisted-workflows-thumb.png
tags:
  - ai
  - product
  - ux
  - process
images:
  - src: "./content/design/ai-assisted-workflows/AIW-04-jonny-presenting.png"
  - src: "./content/design/ai-assisted-workflows/AIW-05-research-synthesis-figma.png"
  - src: "./content/design/ai-assisted-workflows/AIW-07-figma-mcp-tokens.png"
  - src: "./content/design/ai-assisted-workflows/AIW-08-figma-components.png"
  - src: "./content/design/ai-assisted-workflows/PTR-102-marketing-about-before.png"
  - src: "./content/design/ai-assisted-workflows/PTR-106-site-about-after.png"
  - src: "./content/design/ai-assisted-workflows/PTR-108-client-portal-map-view.png"
  - src: "./content/design/ai-assisted-workflows/ptr-after-client-portal-3-dashboard.png"
  - src: "./content/design/ai-assisted-workflows/PTR-43-ptr-handoff.png"
---

Designing assisted systems that compress the distance between research, product definition, prototyping, and engineering implementation.

- **Role:** Product Designer
- **Company:** Priority Tax Relief
- **Timeline:** 2025–2026
- **Platform:** Responsive web, internal CRM tools, design system
- **Team:** Solo designer supporting engineering and marketing teams
- **Tools:** Claude, Hermes Agent, Figma, Figma MCP, Claude Design, ChatGPT, Gemini, Daisy UI, Tailwind, React, HTML/CSS/JS, GitHub Pages, WordPress
- **Outcome:** Shipped rebranded website, design system package, and clickable prototypes in hours instead of days.


{% image "./AIW-04-jonny-presenting.png", "Jonny presenting AI-assisted workflow process" %}

Opening up my design process to a collaborator is not a switch I can just turn on and run. As a late diagnosed adhd-er, I had built more self-process and shorthand into how I work than I had openly realized. To me, it's an organized chaos - I push and pull and shape and work and rework until the form that was already there starts to come out on its own. It's sculpture as applied to user experience, data, company processes, and digital platforms.

```
Research → Notes → PRD → Mockup / Prototype → TDD → Engineering → Release
```

My 'traditional' product workflow created gaps between conversations with product leaders or customer research, lengthy documentation artifacts, visual design studies, and engineering research. The valuable connecting context could get lost as ideas moved between formats.

I wanted to explore whether AI tools could reduce the friction between these stages while preserving human decision-making. Not replacing design judgment, but extending research and synthesis, speeding up prototyping, and helping enrich my communication.

## AI as Research Partner

The real value of seemingly unconnected observations found through research is almost intangible without hindsight. However the conversation that research artifacts set up seem so natural and inevitable. As a design consultant it can be hard to just say "well I spoke to your customers and this is the thing they actually want" this work takes a lot of time and trust to do.

I'm not trying to replace research methods, but even introducing an analysis layer to surface patterns faster is a huge boon. By keeping the task simple and straightforward, the computer can do the production work and the results can be evaluated through my design judgment.

**Before:**
```
45 minute stakeholder conversation
Written or digital notes, transcripts

Double as much time combing back through to tag topics
or cross reference to another interview
```

**After:**
```
45 minute, guided group discussion and group note taking
Topic → Hypothesis → Underlying issues → Possible solutions → Impact / Effort

Themes:
- Trust
- Transparency
- User confusion
- Workflow gaps

Design questions:
- How might we expose status?
- Where does user control matter?
```

Structured conversational process board to get the group asking the right questions and stepping through a process of understanding the issue at hand, along with the business and customer context that it's happening in.

{% image "./AIW-05-research-synthesis-figma.png", "Discovery session synthesis in Figma, sticky note analysis tool breaking down themes by topic" %}

*Discovery session synthesis, instead of going through every recording manually, AI boils it down into key design questions and themes. I can jump straight to "people wrote the most about information transparency and client confidence" and map that to a feature prototype.*

The analysis that used to take a dedicated researcher a week (tagging, theming, timestamping) now can happen in hours. Depending on quality of recording and materials used. It's not as accurate as a good researcher sitting down and doing the work. But I can say from experience that this process creates forward movement, and sometimes that's what is needed to keep a client happy.

## Writing Test Scripts

To test the understanding of the latest reporting dashboard I made, I didn't write every test question myself. I gave an AI the structure of the test I wanted, the visual pages, the tasks I wanted to see and I got back a pretty good first draft. Then I rewrote it to understand and solidify the test.

Generation, refinement, then actual usability sessions. Take the recordings and the script, feed it back: "did someone get to that feature? How fast? What was their sentiment?" Go crunch the numbers and give me a chart of task-to-completion.

The better the structured test is, the better the structured results. Design research is about finding out what's actually happening. By leveraging AI tools to study and breakdown our hunches faster, we can better see and understand our blind spots too.

## From Conversation → Product Definition

A Product Requirements Document is a valuable scoping artifact, primarily so everyone in the room can point to a shared understanding of what we are doing and what we are not doing.

This is the biggest personal opportunity I found: using AI tools to transform classic 'whiteboard' conversations into structured product artifacts. Popped open ChatGPT voice mode on a two-hour drive to Bellingham, pure conversational: "If I built this feature, let's talk through what a general PRD would look like, don't get technical yet. What could be on the page, what datapoints, what's important, how do you present this information at the top that's positive?"

I like to treat markdown text like charcoal drawing, you need to put material on the page in order to work with it and refine it into the thing you're trying to make. But you need material on the page first in order to get anywhere.

**Input:**
> "Users need an easier way to understand this workflow, let's talk thru how that could be done."

**Output:**
```
Problem statement
User needs
Requirements
Edge cases
Technical flags
Success metrics
```

## From Product Definition → Prototype

Because I have frontend development experience, I use AI-assisted coding workflows to quickly test interface concepts and explore implementation realities. When asked for a short timeline on a marketing site redesign, I decided to take a pragmatic approach and demonstrate instead of just show my thinking.

I downloaded ~20 final pages from a WordPress site, what the browser actually rendered. Pulled these into Claude Design and said here's the starting point, let's clean up and rethink these pages as a simple HTML site that leverages my new design system. Now we have a new site, same content, that we can actually look and touch and feel the differences proposed instead of just talking about them.

```
Design idea → Component model → React prototype → Engineering conversation
```

<div class="two-column">

{% image "./PTR-102-marketing-about-before.png", "Marketing about page, before redesign" %}

{% image "./PTR-106-site-about-after.png", "Marketing about page, after redesign with new design system" %}

</div>

*Element-by-element: "take this HTML page as context. Here's every file that came with it out of WordPress. Let's start going through it element by element, how do we apply this design system?"*

Leveraging the new site structure and a new feature we just wrote a PRD for, I prototyped the new feature idea as a faux login and dashboard to demonstrate how a user would actually access their information. Speeding up the process, solidifying the deliverable, and strengthening the company's ability to grow.

<div class="two-column">

{% image "./PTR-108-client-portal-map-view.png", "Client portal map view prototype" %}

{% image "./ptr-after-client-portal-3-dashboard.png", "Client portal dashboard prototype" %}

</div>

*"What does this pizza tracker start to look like and how does this fit into that existing experience? Oh okay, now we're prototyping new features at the same time as building just a normal reskin of the website."*

The key difference from Figma: this is live HTML. Real stuff. Marketing can look at 10 different things, or they can look at one thing that's all the real stuff and build on that. Much more solid baseline for conversation "tweak this, change that" not "impress me with a big presentation."

{% image "./PTR-43-ptr-handoff.png", "Engineering handoff documentation" %}

The hand off to engineering to complete the work is built into the design process. I already broke everything down into repeatable components so laying out documentation in a digestible manner is a clean deliverable.

## Figma Design Systems + Claude Design

Generated interfaces are only valuable when they become reusable systems. Otherwise it's throwaway work.

```
Experiment → Pattern → Component → System
```

<div class="two-column">

{% image "./AIW-07-figma-mcp-tokens.png", "Figma MCP running locally, pulling design token changes to update the Daisy UI theme" %}

{% image "./AIW-08-figma-components.png", "Design tokens inside Figma matching exactly to the project implementation" %}

</div>

With Figma MCP running locally, I can pull any changes to the theme variables and update the tokens used to generate the Daisy UI theme. The goal: bidirectional sync. Design tokens in Figma (colors, spacing, fonts) exactly match the actual project. Components named the same. Build out a new button or form series in Figma, go directly into prototyping with real components instead of static HTML pages.

I can be on a call with stakeholders: real-time changes in Figma become a pull request instead of email back-and-forth. Avoiding rounds of 'I meant this, I meant that.' The goal here is speeding up the feedback loop between product, design, and engineering.

## Hermes as Orchestration Layer

Hermes isn't just another tool in the stack, I use it as my own platform-agnostic orchestration layer. While Copilot handles code, Claude handles reasoning, and Figma MCP handles design, Hermes runs the persistent context, memory, and multi-agent coordination.

**How I actually use it:**

- **Persistent project memory**: A holographic fact store holds common facts across sessions, client context, design system tokens, team preferences, architectural decisions. I don't re-explain the project every session.

- **Multi-agent delegation**: For the Priority Tax Relief work, I spun up a 7-agent "Neuromancer" crew (backend, frontend, reviewer, researcher, etc.) that runs overnight on a Mac mini. They don't just chat- they write code, run tests, open PRs.

- **Cron jobs as ambient intelligence**: Scheduled jobs scrape topics I'm following, monitor competitor pricing, pull GitHub activity, and deliver daily briefings to Discord. All configured declaratively.

- **MCP server for external tools**: Hermes exposes its tools (web search, file ops, terminal, browser) to Claude Code and VS Code via MCP. So wherever I'm working, I can call Hermes skills without leaving the editor.

- **Skills as procedural memory**: Recurring workflows (PR review, research synthesis, deployment) are encoded as skills. When I load a skill, I get the actual commands, not guesswork.

The key insight: Hermes lets me treat AI as infrastructure, not just one-off chats. The dashboard (kanban, delegation, cron, skills) runs on local hardware 24/7. Anything declarative becomes local code infrastructure for how I'm working, not threaded in memory in a single platform.

## The Future? Human + AI Collaboration

The next generation of software will not only be tools people operate - they will be collaborators people guide.

Across healthcare systems, enterprise software, AI products, and independent tools, my work has focused on one recurring challenge: helping humans interact with increasingly complex technology. Multimodal AI represents the next evolution of that challenge - designing interfaces where intelligent systems become more contextual, transparent, and collaborative.

The value wasn't that AI generated answers. The value was reducing the distance between human intent and machine collaboration.

These workflows are updating in real-time, the tools are changing too fast to say there is any singular defined best way to approach these tasks. And that's good, it's a growing ecosystem that we're all trying to figure out.

Some rules I've learned:
- Be explicit about what you're delegating and what you're keeping in hand
- The "generate a bunch, boil it down" loop only works when you're clear about what the agent is generating and what you're evaluating
- The faster you can put real, interactive work in front of people, the faster you surface actual concerns
