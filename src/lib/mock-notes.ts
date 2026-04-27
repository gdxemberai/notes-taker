import type { Note } from "./types";

export const SAMPLE_NOTES: Note[] = [
  {
    id: "n1",
    title: "Q2 product strategy — north stars",
    content: `Three things to lock in before next week's offsite.

1. **Activation rate**. We've been chasing weekly active too long. The healthier metric is "completed first artefact within 7 days." Pull the chart for the last six cohorts and bring it.

2. **Pricing experiment**. The $19 anchor isn't doing what we hoped. Marco wants to test $24 with the AI bundle pre-included. I'm leaning yes — competitive set has moved.

3. **Retention dip at week 4**. Still unclear whether it's onboarding, value clarity, or just our sample being too small. Need a qualitative round before we ship more onboarding work.

Open question: do we cut the legacy importer this quarter or give it one more pass?`,
    tags: ["strategy", "metrics", "Q2"],
    folder: "work",
    createdAt: "2026-04-21T09:14:00Z",
    updatedAt: "2026-04-26T16:42:00Z",
  },
  {
    id: "n2",
    title: "Coffee with Marco — debrief",
    content: `Met Marco at Blue Bottle. He's frustrated with the European launch timeline but doesn't say it directly.

Things he's worried about:
- Localisation work has slipped twice
- Legal review for DACH took 6 weeks vs the 3 we estimated
- Sales team isn't ready, no enablement materials yet

What he wants:
- A single owner for the launch (currently nobody)
- A go/no-go date in writing
- Permission to delay if the work isn't ready

I think he's right. Will propose Tuesday.`,
    tags: ["1:1", "europe-launch"],
    folder: "work",
    createdAt: "2026-04-25T15:00:00Z",
    updatedAt: "2026-04-25T16:30:00Z",
  },
  {
    id: "n3",
    title: "Reading list — April",
    content: `Books I'm working through.

**Currently reading**
- *The Power Broker* — Caro. Chapter 12. Glacial pace but every page rewards.
- *High Output Management* — Grove. Re-read. Holds up.

**Next**
- *Working in Public* — Eghbal
- *The Mom Test* — Fitzpatrick (long overdue)

**Articles bookmarked**
- Patrick Collison on the slow disappearance of "real" research labs
- Stratechery's piece on Anthropic's distribution strategy
- That McKinsey thing on AI productivity (skim, low expectations)`,
    tags: ["reading", "books"],
    folder: "personal",
    createdAt: "2026-04-08T20:11:00Z",
    updatedAt: "2026-04-22T07:55:00Z",
  },
  {
    id: "n4",
    title: "Idea: ambient meeting summariser",
    content: `What if your laptop's mic was always (consensually) listening during meetings, and at the end you got:

- A 3-bullet "what was decided"
- Action items per person
- A "what was promised but unclear" list (the gold)

The third one is the differentiator. Every existing tool gives you the first two. Nobody does the third.

Risk: privacy, obviously. But if it runs locally and the audio never leaves the device, that's defensible.

Worth a weekend prototype.`,
    tags: ["ideas", "ai", "weekend-project"],
    folder: "ideas",
    createdAt: "2026-04-19T22:03:00Z",
    updatedAt: "2026-04-19T22:31:00Z",
  },
  {
    id: "n5",
    title: "Apartment hunt — west side",
    content: `Three to see this Saturday.

**18th & Geary** — top floor, light, but the kitchen is awful. $4,200.
**Divisadero** — same building as Sara. Convenient. Walk-up. $3,950.
**Outer Sunset** — more space than I need, but the garage is clutch. $4,400 with parking.

Budget cap is $4,300. The Sunset one is over but the parking saves me $300/mo at the current spot. So really it's $4,100 effective.

Decision criteria, in order: light, kitchen, neighbourhood, parking.`,
    tags: ["apartment", "personal"],
    folder: "personal",
    createdAt: "2026-04-26T11:00:00Z",
    updatedAt: "2026-04-27T08:15:00Z",
  },
  {
    id: "n6",
    title: "Hiring — staff eng pipeline",
    content: `Five candidates in the funnel. Quick read on each:

**Anika R.** — Strong on systems, weaker on leadership signals. The kind of person who's been a great senior for 8 years and might or might not step up.

**Jamie T.** — Very polished. Suspiciously polished. Need to dig into the "led the migration" claim — what was scope, who actually did the work.

**Devon C.** — Internal. Already doing the job de facto. Not interviewing — I'd be promoting. Need to make the call before he gets recruited out.

**Sam L.** — From a competitor. Cultural fit's a gamble but the technical bar is the highest of the five.

**Riya M.** — Early-career-staff. Could go either way. Worth one more round.

Decision-forcing function: I'm at 11 reports. Need to pick by mid-May.`,
    tags: ["hiring", "team"],
    folder: "work",
    createdAt: "2026-04-23T13:45:00Z",
    updatedAt: "2026-04-26T19:20:00Z",
  },
  {
    id: "n7",
    title: "Workout log — week of 4/20",
    content: `Mon — Push. Bench 5×5 @ 175. OHP 3×8 @ 105. Felt strong.
Tue — Run 5k. 24:18. Slower than I'd like.
Wed — Pull. Deadlift 3×5 @ 285. Form was off rep 4 set 2, dropped it.
Thu — Rest.
Fri — Legs. Squat 5×5 @ 215. Lunges 3×10/leg with 30s.
Sat — 10k run. 49:42. Easy effort.
Sun — Mobility + sauna.

Sleep was 6h avg, weight stable at 174.`,
    tags: ["fitness"],
    folder: "personal",
    createdAt: "2026-04-26T20:00:00Z",
    updatedAt: "2026-04-26T20:00:00Z",
  },
  {
    id: "n8",
    title: "Old onboarding flow — archived",
    content: `Don't ship this version. Kept for reference because the empty-state copy was actually decent.

Step 1: account create
Step 2: connect data source
Step 3: import workspace
Step 4: invite teammates

Replaced with the 2-step version on 4/14.`,
    tags: ["archive"],
    folder: "archive",
    createdAt: "2026-03-02T10:00:00Z",
    updatedAt: "2026-04-14T11:30:00Z",
  },
];
