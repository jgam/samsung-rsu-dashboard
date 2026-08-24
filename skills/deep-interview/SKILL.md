---
name: deep-interview
description: Conduct an adaptive discovery interview that turns an app, product, automation, or software idea into a build-ready project brief. Use when a user wants help clarifying what to make before implementation, including outcomes and ROI, user problem, design direction, data sources, integrations, delivery constraints, and optional project-specific AGENTS.md coding guidance.
---

# Deep Project Interview

Guide the user from an initial idea to a concrete, testable project definition. Be curious, practical, and concise. Treat their answers as context; do not repeat questions already answered.

## Interview approach

Start by briefly reflecting the idea in plain language and ask one high-leverage question at a time. Prefer 5–10 focused questions total; skip categories that are irrelevant or already clear. Explain unfamiliar terms in plain language. Offer reasonable options when the user is uncertain, but let them choose.

Prioritize these areas, adapting the order to the project:

1. **Outcome and ROI** — Ask what success changes, who benefits, the ultimate goal, why now, how value or ROI will be measured, and any baseline, target, budget, deadline, or risk tolerance. Do not invent financial returns; label assumptions and proposed metrics.
2. **Problem and users** — Ask whose problem it solves, their current workflow and pain points, primary and secondary users, key use cases, and the smallest useful first release.
3. **Product scope** — Ask for the essential user journey, must-have capabilities, explicitly out-of-scope work, platforms, accounts/roles, notifications, payments, and integrations where applicable.
4. **Design and voice** — Ask what the experience should feel like, any references or brand requirements, accessibility needs, visual style, and whether speed, simplicity, trust, or delight matters most.
5. **Data and intelligence** — Ask what data is needed, its source and owner, how it arrives (manual entry, file, API, database, event stream), freshness, quality, retention, permissions, privacy/security needs, and whether AI is involved. Identify unknowns and suggest a safe placeholder data strategy when useful.
6. **Build and operations** — Ask about existing code, preferred stack or deployment environment, authentication, cost limits, performance/reliability needs, compliance, team skills, launch target, and how the result will be evaluated after release.
7. **Project conventions** — Ask whether to create a local `AGENTS.md` with coding and collaboration guidelines. If yes, gather conventions: languages/frameworks, architecture, testing and linting commands, formatting, security rules, file layout, design-system rules, git/PR expectations, and forbidden changes. Never create or modify `AGENTS.md` until the user explicitly authorizes it and confirms the target project directory.

## Keep momentum

- If the user gives a vague answer, offer two or three concrete interpretations and ask which is closest.
- If a decision blocks many later choices, surface it early and note the trade-off.
- Distinguish facts, assumptions, decisions, and open questions.
- Do not turn discovery into implementation unless the user asks to proceed.
- If the user asks to stop early, synthesize what is known and identify the few highest-impact unknowns.

## Close with a build-ready brief

When the core decisions are clear, return a compact brief with:

- **Project and one-sentence value proposition**
- **Users, problem, and ultimate outcome**
- **Success measures and ROI hypothesis**
- **MVP scope and explicit non-goals**
- **Key user flow and design direction**
- **Data sources, integrations, and security/privacy constraints**
- **Technical and delivery approach**
- **Decisions made, assumptions, risks, and open questions**
- **Recommended next step** — such as a requirements document, wireframe, architecture, implementation plan, or scaffold

Use a short table only when it makes decisions or metrics easier to scan. Ask for confirmation before treating the brief as final or beginning a build.
