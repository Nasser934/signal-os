# Signal OS — Sprint Planning Framework

> **Version**: v1.0  
> **Sprint Cycle**: 2 weeks (10 working days)  
> **Last Updated**: 2026-05-26  

---

## 1. Team Configuration

### 1.1 Team Roster

| Member | Role | Primary Skills | Secondary Skills |
|--------|------|---------------|------------------|
| Alex (TL) | Tech Lead / Full Stack | System Architecture, Scoring Engine, DevOps | Code Review, Mentoring |
| Maya | Senior Frontend Engineer | Next.js 15, React, TypeScript, Tailwind, UI/UX | Accessibility, Performance |
| Raj | Senior Backend Engineer | Python, FastAPI, PostgreSQL, Redis, API Design | ML/ONNX Integration |
| Soo-jin | ML / Data Engineer | Feature Extraction, ONNX Models, NLP Pipelines, Scoring Algorithms | Data Analysis |
| Diego | QA / Test Engineer | Automated Testing, Cypress, Playwright, Load Testing | CI/CD Pipelines |
| Priya | Product Engineer (Frontend) | React Components, Dashboards, Data Visualization, Charts | UX Writing |

### 1.2 Capacity Defaults

```
Sprint Duration: 10 working days
Effective Hours/Day: 6 hours (8-hour day minus meetings, breaks, admin)
Focus Factor: 0.8 (accounts for context switching, Slack, code reviews)
```

### 1.3 Individual Capacity Formula

```
Individual Capacity (hrs) = Available Days x 6 hrs/day x 0.8
```

| Member | Available Days/Sprint | Capacity (hrs) | SP Capacity (est.) |
|--------|----------------------|----------------|-------------------|
| Alex | 9 (1 day TL duties) | 43.2 | 8 SP |
| Maya | 10 | 48.0 | 10 SP |
| Raj | 10 | 48.0 | 10 SP |
| Soo-jin | 10 | 48.0 | 10 SP |
| Diego | 10 | 48.0 | 10 SP |
| Priya | 9 (1 day product sync) | 43.2 | 8 SP |
| **Total** | **58** | **278.4** | **56 SP** |

---

## 2. Historical Velocity Tracker

### 2.1 Velocity Log

| Sprint | Dates | Committed | Completed | Velocity | Notes |
|--------|-------|-----------|-----------|----------|-------|
| Sprint 0 (Setup) | May 12–23 | — | — | Baseline | Infrastructure, repo setup, team onboarding |
| Sprint 1 | May 26 – Jun 6 | 32 | TBD | TBD | Core scoring engine + auth |
| Sprint 2 | Jun 9–20 | TBD | TBD | TBD | Content input + dashboard UI |
| Sprint 3 | Jun 23 – Jul 4 | TBD | TBD | TBD | Optimization engine + first-time UX |
| Sprint 4 | Jul 7–18 | TBD | TBD | TBD | Publishing + viral features |
| Sprint 5 | Jul 21 – Aug 1 | TBD | TBD | TBD | Team collaboration + viral growth |

### 2.2 Velocity Projection

```
Sprint 1 Target: 32 SP (conservative — new team forming)
Sprint 2 Target: 38 SP (+18% — team norms established)
Sprint 3 Target: 42 SP (+10% — process optimization)
Sprint 4+ Target: 45 SP (stable velocity)
```

**Reference Velocity for Planning**: Use rolling average of last 3 sprints. For Sprint 1, use 32 SP (70% of total 56 SP capacity as conservative estimate).

---

## 3. Sprint Planning Templates

### 3.1 Pre-Planning Checklist

- [ ] Product Backlog is prioritized and groomed
- [ ] All stories have acceptance criteria
- [ ] Story points estimated by the team
- [ ] Dependencies identified and flagged
- [ ] Team availability confirmed (PTO, holidays)
- [ ] Previous sprint retrospective actions reviewed
- [ ] Definition of Ready (DoR) checklist verified for each candidate story

### 3.2 Definition of Ready (DoR)

| Criterion | Check |
|-----------|-------|
| Story has clear user value statement |
| Acceptance criteria are specific and testable |
| Story points estimated (1, 2, 3, 5, 8, or 13) |
| Dependencies identified (none / internal / external) |
| UI mockups attached (if user-facing) |
| API contracts defined (if backend-dependent) |
| No blockers or external dependencies unresolved |
| Story fits within one sprint (<= 8 SP preferred) |

### 3.3 Definition of Done (DoD)

| Criterion | Check |
|-----------|-------|
| Code implemented and follows style guide |
| Unit tests written, all passing (>= 80% coverage) |
| Integration tests passing |
| Code reviewed and approved by 1+ team member |
| QA tested on staging environment |
| No critical or high bugs open |
| Documentation updated (API docs, README if needed) |
| Feature flag configured (if behind toggle) |
| Performance benchmarked (if performance-sensitive) |
| Accessibility checked (WCAG 2.1 AA for UI) |
| Deployed to staging and verified |
| Product Owner accepted |

---

## 4. Sprint 1 Plan — Foundation

### 4.1 Sprint Goal

> **Deliver the core AI scoring engine with X authentication and a working end-to-end scoring flow, so beta users can paste content and receive their first Signal Score.**

### 4.2 Capacity

| Member | Role | Available Days | Capacity (hrs) | SP Load |
|--------|------|---------------|----------------|---------|
| Alex | Tech Lead | 9 | 43.2 | 7 SP |
| Maya | Senior Frontend | 10 | 48.0 | 9 SP |
| Raj | Senior Backend | 10 | 48.0 | 8 SP |
| Soo-jin | ML Engineer | 10 | 48.0 | 8 SP |
| Diego | QA Engineer | 10 | 48.0 | 0 SP (infrastructure + testing) |
| Priya | Product Eng | 9 | 43.2 | 0 SP (Sprint 0 carryover) |
| **Total** | | **58** | **278.4** | **32 SP committed** |

**Buffer**: 24% reserved for onboarding, environment setup, unexpected issues.

### 4.3 Story Assignments

| # | Story | Priority | Points | Owner | Dependencies | Acceptance Criteria |
|---|-------|----------|--------|-------|--------------|-------------------|
| S1-01 | X OAuth 2.0 authentication flow | Must | 5 | Raj | None | User can login with X; callback handled; JWT issued; session persisted |
| S1-02 | Content input component (paste + analyze CTA) | Must | 3 | Maya | None | Text area accepts 1-280 chars; real-time char counter; analyze button triggers API |
| S1-03 | 8-dimension scoring pipeline (ONNX backend) | Must | 8 | Soo-jin + Alex | S1-01 (auth token) | All 8 dimensions scored; ONNX inference <200ms p50; weighted aggregation correct |
| S1-04 | Score results UI (8 cards with dimension scores) | Must | 5 | Maya | S1-02, S1-03 | 8 cards render with scores; color coding (red/yellow/green); total score prominent |
| S1-05 | Hook Quality dimension model (fine-tuned) | Must | 5 | Soo-jin | None | Model accuracy >= 85% on validation set; inference <50ms; ONNX export successful |
| S1-06 | Readability + Structure scoring modules | Must | 3 | Soo-jin | None | Flesch-Kincaid implemented; structure detection (lists, paragraphs, hooks); sub-50ms |
| S1-07 | Staging environment deployment (CI/CD) | Must | 3 | Alex + Diego | All above | Vercel frontend deploys on push; Railway backend auto-deploys; smoke tests run |

**Total Committed**: 32 SP

### 4.4 Dependency Analysis

```
Dependency Chain:
S1-01 (Auth) ─────┬──→ S1-03 (Scoring Pipeline) ──→ S1-04 (Score UI)
                  │
S1-05 (Hook Model) ┘
S1-06 (Readability) ┘

S1-02 (Input UI) ────────────────────────────────→ S1-04 (Score UI)

S1-07 (Deploy) depends on: S1-01, S1-02, S1-03, S1-04, S1-05, S1-06
```

**Critical Path**: S1-01 → S1-03 → S1-04 (longest chain: 5 + 8 + 5 = 18 SP)

### 4.5 Workload Distribution

| Member | Assigned SP | Load % | Status |
|--------|-------------|--------|--------|
| Alex | 7 SP (S1-03 partial, S1-07) | 87% | Optimal |
| Maya | 8 SP (S1-02, S1-04) | 80% | Optimal |
| Raj | 8 SP (S1-01, S1-07 partial) | 80% | Optimal |
| Soo-jin | 16 SP (S1-03 partial, S1-05, S1-06) | 160% | **OVERLOADED** |
| Diego | 0 SP (infra/testing) | 0% | Infrastructure sprint |

**Rebalancing Required**: S1-06 (3 SP) reassign from Soo-jin to Raj. S1-03 pair: Soo-jin leads scoring logic, Alex handles API integration.

**Rebalanced Distribution**:

| Member | Assigned SP | Load % | Status |
|--------|-------------|--------|--------|
| Alex | 7 SP | 87% | Optimal |
| Maya | 8 SP | 80% | Optimal |
| Raj | 11 SP (S1-01, S1-06, S1-07 partial) | 110% | **High** — monitor |
| Soo-jin | 13 SP (S1-03, S1-05) | 130% | **High** — core ML work |
| Diego | 0 SP | 0% | Infrastructure |

**Mitigation**: S1-05 (Hook Model) has 20% buffer built in. If at risk, use baseline model v1.

### 4.6 Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| ONNX model inference >200ms | Medium | High | Fallback to lighter model; optimize with ONNX Runtime |
| X API rate limits during testing | Medium | Medium | Use mock responses for dev; rate limit handling |
| Team forming storming delays | Low | Medium | Daily standups; pair programming for critical path |
| Soo-jin overloaded on ML stories | High | High | Raj takes S1-06; baseline model as fallback |

---

## 5. Sprint 2 Plan — Content Intelligence

### 5.1 Sprint Goal

> **Deliver the complete content analysis experience with sentiment scoring, competitive benchmarking, historical tracking, and an insights dashboard.**

### 5.2 Target Capacity

| Member | Available Days | Capacity (hrs) | SP Load |
|--------|---------------|----------------|---------|
| Alex | 10 | 48.0 | 10 SP |
| Maya | 10 | 48.0 | 12 SP |
| Raj | 10 | 48.0 | 10 SP |
| Soo-jin | 10 | 48.0 | 8 SP |
| Diego | 10 | 48.0 | 8 SP |
| Priya | 10 | 48.0 | 5 SP |
| **Total** | **60** | **288.0** | **38 SP** |

### 5.3 Story Assignments

| # | Story | Priority | Points | Owner | Dependencies |
|---|-------|----------|--------|-------|--------------|
| S2-01 | Emotional Pull + Timing scoring modules | Must | 5 | Soo-jin | S1-03 pipeline |
| S2-02 | Engagement Likelihood prediction model | Must | 5 | Soo-jin | S1-03 pipeline |
| S2-03 | Competitive benchmarking (vs top posts) | Must | 5 | Raj | S1-03 scores |
| S2-04 | Score history + trends (user dashboard) | Must | 5 | Maya | S1-04 score UI |
| S2-05 | Insights panel (strengths/weaknesses analysis) | Must | 5 | Maya + Priya | S1-04, S2-01 |
| S2-06 | Sentiment analysis integration | Must | 3 | Soo-jin | S1-03 pipeline |
| S2-07 | First-time user onboarding flow | Must | 5 | Priya | S1-02, S1-04 |
| S2-08 | Automated E2E test suite (Cypress) | Must | 5 | Diego | All S1 stories |
| S2-09 | Performance optimization pass | Should | 3 | Alex | All above |
| S2-10 | Beta feedback collection widget | Could | 2 | Priya | S2-07 |

**Total Committed**: 38 SP (with S2-10 as stretch)

---

## 6. Estimation Reference Card

### 6.1 Story Points Scale

| Points | Complexity | Effort | Discussion Needed | Example |
|--------|------------|--------|-------------------|---------|
| 1 | Trivial | Few hours | None | Copy change, config toggle |
| 2 | Simple | Half day | Minimal | Bug fix with clear cause |
| 3 | Low-Medium | 1–2 days | Brief | New API endpoint (CRUD) |
| 5 | Medium | 2–3 days | Some | New feature with UI + API |
| 8 | Complex | 3–5 days | Significant | ML model integration |
| 13 | Very Complex | Full sprint | Extensive | Full subsystem — **must split** |

### 6.2 INVEST Criteria Checklist

Use before committing any story to a sprint:

| Criterion | Question | Pass? |
|-----------|----------|-------|
| **I**ndependent | Can this be delivered standalone? | |
| **N**egotiable | Is the implementation approach flexible? | |
| **V**aluable | Does this deliver clear user value? | |
| **E**stimable | Can the team confidently point this? | |
| **S**mall | Can this complete within one sprint? | |
| **T**estable | Are acceptance criteria clearly defined? | |

---

## 7. Daily Standup Template

```
## Daily Standup — [Date]

### Alex
- Yesterday: 
- Today: 
- Blockers: 

### Maya
- Yesterday: 
- Today: 
- Blockers: 

### Raj
- Yesterday: 
- Today: 
- Blockers: 

### Soo-jin
- Yesterday: 
- Today: 
- Blockers: 

### Diego
- Yesterday: 
- Today: 
- Blockers: 

### Priya
- Yesterday: 
- Today: 
- Blockers: 

### Key Decisions
- 

### Escalations
- 
```

---

## 8. Sprint Review & Retrospective

### 8.1 Sprint Review Checklist

- [ ] Demo all completed stories to stakeholders
- [ ] Review velocity vs. commitment
- [ ] Update product backlog based on feedback
- [ ] Capture new feature requests / bugs
- [ ] Update roadmap if needed

### 8.2 Sprint Retrospective Format

| Category | Prompt | Actions |
|----------|--------|---------|
| **What Went Well** | What should we keep doing? | |
| **What Needs Improvement** | What should we change? | |
| **Action Items** | Specific changes for next sprint | Owner / Due |

### 8.3 Velocity Trend Dashboard

```
Sprint 1: ████████████████████████████████░░░░░░░░  32/32  (100%)
Sprint 2: TBD
Sprint 3: TBD
Sprint 4: TBD
Sprint 5: TBD

Target: 45 SP/sprint at steady state
```

---

## 9. Risk Review & Commitment Checklist

Use before finalizing every sprint plan:

| # | Check Item | Threshold | Status |
|---|-----------|-----------|--------|
| 1 | Total SP within 80–100% of reference velocity? | 32–45 SP | |
| 2 | Each member load between 60–100%? | 60–100% | |
| 3 | Load deviation ≤ 20% from team average? | ±20% | |
| 4 | No circular dependencies? | Zero | |
| 5 | External dependencies flagged with risk? | All flagged | |
| 6 | Critical path assigned to 2+ people? | Yes | |
| 7 | 10–15% buffer reserved? | ≥10% | |
| 8 | No stories > 13 SP without splitting? | Zero | |
| 9 | No single member carries > 40% of total SP? | <40% | |
| 10 | All stories meet Definition of Ready? | 100% | |
| 11 | Pair programming scheduled for critical path? | Yes | |
| 12 | Rollback plan for risky deployments? | Documented | |

---

## 10. Story Point Conversion Reference

For cross-referencing with time-based planning:

```
1 SP ≈ 2–4 hours of focused development
3 SP ≈ 1–2 days
5 SP ≈ 2–3 days
8 SP ≈ 3–5 days
13 SP = MUST SPLIT (more than one sprint)

Team throughput: ~5.6 SP per person per sprint (at 56 SP / 6 people)
Focus hours per SP: ~4.5 hours (278.4 hrs / 56 SP capacity)
```

---

## 11. Escalation Matrix

| Scenario | Action | Escalate To |
|----------|--------|-------------|
| Story blocked > 4 hours | Request pair programming | Tech Lead |
| Scope change mid-sprint | Product Owner review | PO + Tech Lead |
| Technical debt discovered | Document + estimate | Tech Lead |
| Team member unavailable > 1 day | Redistribute stories | Engineering Manager |
| Critical path at risk | Pull from buffer / cut scope | PO + Tech Lead |
| External dependency delayed | Flag in standup + adjust plan | Project Lead |

---

*This framework follows Scrum Guide 2020, Mike Cohn's Agile Estimating and Planning, and SAFe methodology. Update velocity and capacity after each retrospective.*
