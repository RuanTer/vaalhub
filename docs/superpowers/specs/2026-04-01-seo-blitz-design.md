# VaalHub SEO Blitz — Design Spec
**Date:** 2026-04-01
**Status:** Approved — ready for implementation
**Goal:** Publish ~5,741 pending businesses, give every business an online presence discoverable via Google search.

---

## Overview

Transform VaalHub from a 910-business portal into a 6,651-business local SEO powerhouse for the Vaal Triangle. The plan has five parts: bulk publishing pipeline, template descriptions, two code bug fixes (URLs + OG image), 117 new service+location landing pages, and SEO infrastructure wiring.

---

## Part 1 — Publishing Pipeline

### Qualifying criteria (Tier B)
Publish all pending records meeting ALL of:
- `phone IS NOT NULL AND phone != ''`
- `address IS NOT NULL AND address != ''`
- `area IN (known Vaal Triangle areas)` — see exclusion list below

**Expected result:** ~5,741 new published businesses (from 6,753 pending − 146 out-of-area − duplicates already in published set).

### Area exclusion list
Exclude any record whose `area` is not in the recognised Vaal Triangle set. Known bad values discovered in data audit: US cities (Houston, New York, Florida, Georgia, Arizona, Montana, Missouri, Minneapolis, Fort Lauderdale), non-Vaal SA cities (Johannesburg, Pretoria, Sandton, Midrand, Boksburg, Edenvale, Rivonia, Soweto, Aliwal North, Livingstone, Grotto Bay, Hartbeesfontein), and garbage strings (e.g. "812 522", "Race", "Drive", "Office No").

### Implementation
- New **"Bulk Publish"** button in CMS (Pipeline tab, after Quality Scorer)
- Button runs a single SQL `UPDATE` with the qualifying criteria
- Shows a confirmation dialog: "This will publish X businesses. Proceed?"
- Logs result to `scrape_log`
- Businesses with `google_photo_url` sort higher in `/businesses` listing (add `ORDER BY CASE WHEN google_photo_url IS NOT NULL THEN 0 ELSE 1 END, google_rating DESC NULLS LAST`)

### Pre-publish steps (manual, in order)
1. Run Quality Scorer — Pipeline Step 7
2. Run Bulk Publish button
3. Run prerender script — `npm run prerenders` in `vaalhub-git/`
4. Deploy frontend build — `npm run build:full`
5. Submit sitemap to Google Search Console

---

## Part 2 — Business Descriptions (Hybrid)

### Phase 1 — Template descriptions (at publish time, zero API cost)

A Python function `generate_template_description(business)` runs during the bulk publish process and writes a description to every record that has `description IS NULL OR description = ''`.

**Template logic:**
```
"{name} is a {category} business located in {area}, serving the Vaal Triangle community.
[If google_rating]: Rated {rating}★ on Google{' with ' + str(review_count) + ' reviews' if review_count}.
[If tags]: Services include {tag1}, {tag2}, {tag3}.
[If operating_hours]: {days_open_summary}."
```

**Rules:**
- Never overwrite an existing description (COALESCE pattern — same as upsert_business)
- Tags: take first 3, comma-separated, lowercase
- Hours: parse "Monday8 am–5 pm..." format into "Open Mon–Sat" summary
- Max 3 sentences, always ends with a full stop

### Phase 2 — AI rewrites (deferred, low cost)

After Phase 1 ships:
- Batch job rewrites top 500 businesses by `google_rating DESC` using `claude-haiku-4-5` (cheapest model — ~$0.003 total for 500)
- Sets `ai_reworded = 1` on rewritten records
- Business owner claiming their listing triggers an AI description rewrite as a perk
- Model: `claude-haiku-4-5-20251001` (use cheapest, descriptions are short)

---

## Part 3 — URL & Social Sharing Fixes

### Fix 1 — Slug in business card links (Businesses.jsx)

**File:** `vaalhub-git/src/pages/Businesses.jsx`

Two locations use `to={\`/businesses/${biz.business_id}\`}` (lines 570 and 727).

Change both to:
```jsx
to={`/businesses/${biz.business_id}/${slugify(biz.business_name || biz.name || '')}`}
```

The `slugify()` function already exists in `BusinessDetail.jsx` — extract to a shared util or duplicate inline.

**Impact:** Browser address bar and all shared links become keyword-rich (e.g. `/businesses/123/vanderbijlpark-hardware`). Canonical tag in `BusinessDetail.jsx` already generates the correct slug URL — this fix aligns the navigation links to match.

### Fix 2 — OG image fallback to google_photo_url (useSEO.js)

**File:** `vaalhub-git/src/hooks/useSEO.js`

Current line 316:
```js
const image = absoluteUrl(business.logo_url) || DEFAULT_IMAGE;
```

Change to:
```js
const image = absoluteUrl(business.logo_url) || absoluteUrl(business.google_photo_url) || DEFAULT_IMAGE;
```

**Impact:** 74% of Google Maps records have a `google_photo_url`. Sharing a business page on WhatsApp, Facebook, LinkedIn, or Slack will show the actual business photo instead of the generic VaalHub logo.

### Fix 3 — Prerender shells for new business pages

After bulk publish, run the existing prerender script to generate static HTML shells for all new business pages. Social media crawlers (WhatsApp, Facebook, LinkedIn) do not execute JavaScript — they need these prerendered shells to show the correct og:title, og:description, and og:image.

**Command:** `cd vaalhub-git && npm run prerenders`

This script fetches all published businesses from the API and writes `/public/businesses/{id}/{slug}/index.html` for each. Must be run before `npm run build`.

---

## Part 4 — Service+Location Landing Pages (117 pages)

### Route
Already exists: `/businesses/services/:serviceSlug/:locationSlug`
Component: `vaalhub-git/src/pages/ServiceLanding.jsx`

### What needs building/upgrading

The `ServiceLanding.jsx` component currently handles service-only pages (`/businesses/services/restaurants`). It needs to handle the location variant too.

**Page structure for `/businesses/services/restaurants/vereeniging`:**

```
H1: Restaurants in Vereeniging
Intro paragraph: "Looking for a restaurant in Vereeniging? VaalHub lists X
restaurants in Vereeniging and the wider Vaal Triangle..."

[Business grid — sorted: photo first, then by google_rating DESC]
  - Shows all published businesses matching category + area
  - BusinessCard with photo, name, rating, phone, address
  - Pagination if > 20 results

[Related links]
  - Other areas: "Restaurants in Vanderbijlpark", "Restaurants in Meyerton"
  - Other categories in this area: "Automotive in Vereeniging", "Retail in Vereeniging"

[FAQ section — schema: FAQPage]
  - "How many restaurants are in Vereeniging?" → "VaalHub lists X restaurants..."
  - "Where can I find the best-rated restaurant in Vereeniging?" → "Based on Google ratings..."
  - "Are there restaurants open on weekends in Vereeniging?" → "Several restaurants in our directory..."
```

### SEO metadata per page (via buildServiceMeta)
- Title: `{Category} in {Area} | VaalHub`
- Description: `Find {count} {category} businesses in {area}. Browse ratings, hours, and contact details on VaalHub — the Vaal Triangle business directory.`
- JSON-LD: ItemList (up to 20 businesses) + FAQPage + BreadcrumbList
- Canonical: `/businesses/services/{serviceSlug}/{locationSlug}`

### API endpoint needed
New endpoint: `GET /api/businesses?category={cat}&area={area}&status=published&limit=20&offset=0`

The category and area filters need to work together. Check if they already work in the existing businesses endpoint — if not, add combined filter support.

### Which combos to generate
Only generate pages where `COUNT(*) >= 3` businesses match. Currently 117 combos qualify. Pages are dynamic (rendered from API data) so they self-update as more businesses are published — no static generation needed.

### Sitemap
Add service+location URLs to the Flask `/api/sitemap.xml` route:
```python
# Query all category+area combos with 3+ published businesses
# Emit <url> for each: /businesses/services/{slugify(cat)}/{slugify(area)}
# changefreq: weekly, priority: 0.7
```

---

## Part 5 — SEO Infrastructure

### Dynamic sitemap (already exists, auto-updates)
`/api/sitemap.xml` already serves all published businesses. Once bulk publish runs, ~5,741 new URLs appear in the sitemap automatically. No code change needed here.

### Service+location sitemap (new)
Add to the same `/api/sitemap.xml` Flask route — a second loop over category+area combos with 3+ businesses. Priority 0.7, changefreq weekly.

### Town pages (light upgrade)
Existing `/towns/:townName` pages gain:
- Live business count pulled from API: "X businesses listed in Vereeniging"
- Top 3 categories shown with counts
- Link to each service+location combo for that town

### Google Search Console (manual step — post deploy)
1. Go to Google Search Console → Sitemaps
2. Submit: `https://vaalhub.co.za/sitemap.xml`
3. Also submit: `https://vaalhub.co.za/api/sitemap.xml`
4. Use URL Inspection tool to request indexing of the homepage
5. Monitor Coverage report over the following 2–4 weeks

---

## Data Issues to Fix During Publish

### Operating hours format
Raw format from scraper: `Monday8 am–5 pmTuesday8 am–5 pm...` (no delimiters)

Two options — pick one:
- **Option A (backend):** Parse in `database.py` during upsert — split on day names, store as JSON `{"Monday": "8 am–5 pm", ...}`
- **Option B (frontend):** Parse in `BusinessDetail.jsx` display layer — regex split on day names, render as structured list

**Recommendation: Option B** — non-destructive, doesn't touch existing data, can be done in one component.

### Area normalisation
Known typo variants in pending data (e.g. "Vereeninging", "Vanderbylpark", "Vanderbiljpark") should be normalised before publish via a one-time SQL UPDATE mapping known bad spellings to canonical names.

---

## File Change Summary

| File | Change |
|------|--------|
| `vaalhub-git/src/pages/Businesses.jsx` | Add slug to business card links (2 locations) |
| `vaalhub-git/src/hooks/useSEO.js` | Add `google_photo_url` as OG image fallback |
| `vaalhub-git/src/pages/ServiceLanding.jsx` | Add location-variant page structure + FAQ + related links |
| `api/app.py` | Add service+location combos to sitemap; verify category+area filter works together |
| `dataScraper/VaalHub Scraper/gui_cms.py` | Add Bulk Publish button to Pipeline tab |
| `dataScraper/VaalHub Scraper/database.py` | Add `generate_template_description()` function |
| `vaalhub-git/src/pages/Towns.jsx` (or per-town) | Add live business count + top categories |

---

## Out of Scope (this iteration)
- Email collection (0% fill — no source available from Google Maps)
- Logo URLs (separate enrichment task — owner upload or logo API)
- Facebook/Instagram links (separate scraper task)
- AI descriptions Phase 2 (deferred — do after Phase 1 ships)
- Hotfrog enrichment pass (separate pipeline step, independent task)
