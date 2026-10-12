# Leroux Lab Website

Website for the **Leroux Lab** in the School of Psychological and Brain Sciences at the Georgia Institute of Technology, led by Dr. Audrey Leroux. The lab studies multilevel modeling and psychological measurement, with a focus on computerized adaptive testing.

**Live site:** https://leroux-website.vercel.app

---

## Contents

- [Overview](#overview)
- [Project structure](#project-structure)
- [Running locally](#running-locally)
- [Editing content](#editing-content)
  - [Adding a news item](#adding-a-news-item)
  - [Adding a publication or presentation](#adding-a-publication-or-presentation)
  - [Adding a team member](#adding-a-team-member)
  - [Moving someone to alumni](#moving-someone-to-alumni)
  - [Adding team photos](#adding-team-photos)
  - [Changing the navigation](#changing-the-navigation)
- [Design system](#design-system)
- [JavaScript behavior](#javascript-behavior)
- [Accessibility](#accessibility)
- [Deployment](#deployment)
- [Open placeholders](#open-placeholders)

---

## Overview

The site is plain HTML, CSS and vanilla JavaScript. There is no framework, no build step, no package manager and no dependencies apart from two Google Fonts. Any text editor can update it, and every file is served exactly as written.

| Page | File | What it contains |
|------|------|------------------|
| Home | `index.html` | Hero with animated particle field, the two research areas, and links to Publications and Join |
| Team | `team.html` | Current members as click-to-expand bio cards, plus former members |
| Publications | `publications.html` | Peer-reviewed articles and conference presentations, grouped by year |
| News | `news.html` | Lab announcements in reverse-chronological order |
| Join | `join.html` | How undergraduates and prospective PhD students can get involved |
| Contact | `contact.html` | Email, mailing address and a pointer to the Join page |

## Project structure

```
leroux-website/
├── index.html           Home page
├── team.html            Team page
├── publications.html    Publications page
├── news.html            News page
├── join.html            Join page
├── contact.html         Contact page
├── stylesheet.css       Every style on the site (one file)
├── main.js              Shared behavior, loaded on every page
├── hero-particles.js    Particle animation, loaded on index.html only
└── images/              Team headshots (create this folder; see below)
```

Each page is self-contained. The header, navigation and footer are copied into every HTML file instead of being included from a shared template. That keeps the site build-free, but it means **a change to the header or footer has to be made in all six files**.

## Running locally

You can open `index.html` directly in a browser. A local server is closer to how the live site behaves, though, because paths and page transitions work exactly as they do in production:

```bash
git clone https://github.com/anvitdivekar/leroux-website.git
cd leroux-website
python3 -m http.server 8000
```

Then open http://localhost:8000. Any other static server works too, for example `npx serve`.

## Editing content

All content lives directly in the HTML. Find the section you want, copy an existing block, and edit the text.

### Adding a news item

In `news.html`, add a new `.news-entry` at the **top** of `.news-list`. Entries are listed newest first.

```html
<div class="news-entry fade-up">
  <p class="news-date">January 2026</p>
  <p class="news-body">Short announcement text.</p>
</div>
```

### Adding a publication or presentation

In `publications.html`, add entries inside the matching `.pub-section`: either **Peer Reviewed Articles** or **Conference Presentations**. Group entries under a year heading, with the newest year first, and use APA style:

```html
<p class="pub-year">2026</p>
<div class="pub-entry fade-up">
  Leroux, A. J., &amp; Lim, J. Y. (2026). Article title. <em>Journal Name, 12</em>(3), 45–67.
  https://doi.org/xx.xxxx/xxxxx
</div>
```

Entries inside a section fade in one after another automatically. You don't need to set any delays.

### Adding a team member

In `team.html`, copy one of the `.team-card` blocks in the first `.team-grid` (current members) and update it:

- `src` and `alt` on the `<img>`
- the name in `<h3>`
- the role in `.team-role`
- the paragraphs in `.team-bio`
- optional links in `.team-bio-links`

Any card that contains a `.team-bio` automatically becomes expandable by click and by keyboard. Remove the `.team-bio` block (and the `.team-expand-hint` line) to get a static card with no bio.

### Moving someone to alumni

Cut the person's card from the current-members grid and paste it into the **Former Members** grid further down the page. Alumni cards usually show only name and role, so delete the `.team-expand-hint` and `.team-bio` blocks.

### Adding team photos

Each card looks for a headshot at `images/<lastname>.jpg`, for example `images/leroux.jpg`. When the file is missing, a neutral silhouette is shown instead. To add photos:

1. Create an `images/` folder in the repo root.
2. Add square JPGs, about 400×400 px, named to match the `src` in `team.html`.
3. Commit and push.

### Changing the navigation

The `<nav class="site-nav">` block appears in all six HTML files. Update every copy. The current page's link is highlighted automatically (`aria-current="page"` is set by `main.js`).

## Design system

All design tokens are CSS custom properties at the top of `stylesheet.css`.

| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#F7F1E3` → `#F3DFC8` | Page background, shifted warmer as you scroll |
| `--navy` | `#1E2A45` | Body text and headings |
| `--accent-primary` | `#E8623D` | Coral: buttons, links, highlights, focus ring |
| `--accent-secondary` | `#E8A23D` | Amber accent |
| `--peach` | `#FCE8D5` | Footer and soft surfaces |
| `--muted` | `#6b7a99` | Secondary text |
| `--max-w` | `1100px` | Content width |

**Typography:** Poppins for headings, Lora for body text, both loaded from Google Fonts.

**Breakpoints:** `768px` (mobile navigation and stacked layouts) and `480px` (small phones).

**Reusable classes:**

| Class | Purpose |
|-------|---------|
| `.container` | Centered, width-capped content wrapper |
| `.section-label` | Small uppercase label above an `h2` |
| `.divider` | Accent line that draws in on scroll |
| `.btn`, `.btn-outline` | Filled and outline buttons |
| `.fade-up` | Fades and slides in when scrolled into view |

## JavaScript behavior

`main.js` runs on every page and does the following:

- **Scroll background shift:** gradually moves `--bg` from cream to warm peach as the page scrolls.
- **Header shrink:** adds `.scrolled` to the header after 40px of scroll, which applies a frosted, compact style.
- **Mobile navigation:** the hamburger button opens the nav with a backdrop. The nav closes on a link click or a backdrop tap.
- **Page transitions:** internal links fade the page out before navigating. Cmd/Ctrl/Shift-clicks and middle-clicks are left alone so links still open in new tabs, and the page fades back in when you return with the back button.
- **Team cards:** cards with a bio expand and collapse on click, Enter or Space. Only one card is open at a time.
- **Scroll reveals:** an `IntersectionObserver` adds `.visible` to `.fade-up` elements, dividers and the footer. News and publication entries are staggered.
- **Active nav link:** sets `aria-current="page"` on the link for the current page.

`hero-particles.js` runs only on the home page. It draws about 160 drifting particles in the lab palette on a `<canvas>` and pushes them away from the mouse cursor.

## Accessibility

- All motion is disabled when the visitor's OS has **Reduce Motion** turned on (`prefers-reduced-motion`). The particle animation, scroll color shift and page transitions are all skipped.
- Team cards are focusable buttons with `aria-expanded`.
- The hamburger button is linked to the nav with `aria-controls` and reports its state with `aria-expanded`.
- Keyboard users get a visible coral focus ring (`:focus-visible`). Mouse users don't see it.
- Decorative elements (the asterisk mark, icons, the canvas, photo placeholders) have `aria-hidden="true"`.

## Deployment

The site is hosted on [Vercel](https://vercel.com) as a static site, with no build command and no output directory. **Every push to `main` deploys to production automatically**, usually within a minute. To deploy manually from a local checkout instead:

```bash
npx vercel          # preview deployment
npx vercel --prod   # production deployment
```

The `.vercel/` folder holds the local project link and is ignored by git.

## Open placeholders

These items still need real content before the site is complete:

- [ ] **Lab email:** `join.html` and `contact.html` use `lab-email@gatech.edu`, which is a placeholder. Replace every occurrence with the real address.
- [ ] **Team photos:** the `images/` folder doesn't exist yet, so every card shows a silhouette.
- [ ] **Publications:** both sections of `publications.html` are empty.
- [ ] **PhD admissions link:** step 3 on `join.html` should link to the official Georgia Tech School of Psychology admissions page.
- [ ] **Office location:** confirm the building and room on `contact.html`.
- [ ] **Favicon:** every page links `favicon.ico`, but the file doesn't exist.

Search for `PLACEHOLDER` to find each spot in the HTML:

```bash
grep -rn "PLACEHOLDER\|lab-email" *.html
```
