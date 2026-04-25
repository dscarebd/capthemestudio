
# CapThemeStudio.xyz — Cinematic CapCut Template Agency

A bold, cinematic, film-inspired website for an international CapCut template-making agency, with an open admin panel to manage team members.

## 🎨 Design Direction

- **Style:** Dark cinematic theme — deep blacks, film-reel motifs, soft warm spotlights, subtle film-grain texture
- **Accent colors:** Cinematic gold + electric cyan highlights with smooth gradient sweeps
- **Typography:** Bold modern display font for headings, clean sans-serif for body
- **Animations:** Smooth scroll reveals, parallax hero, hover lifts on cards, animated gradient backgrounds, looping film-strip motion, marquee of templates, page transitions
- **Language:** Full English (international audience)
- **Imagery:** AI-generated cinematic visuals — neon studio scenes, abstract video timelines, team portraits, template thumbnails

## 📄 Pages

### 1. Home (`/`)
- Cinematic hero with animated gradient + tagline ("Premium CapCut Templates, Crafted for Creators")
- Stats strip (templates delivered, creators served, countries reached)
- Featured templates marquee
- "What we do" section (3–4 services: viral templates, custom edits, brand templates, transitions)
- Why choose us
- **Agency-wide reviews** carousel
- **Agency-wide FAQ** accordion
- CTA to contact

### 2. Our Work (`/our-work`)
- Grid of CapCut template showcases with hover preview cards
- Filter by category (Trending, Cinematic, Vlog, Business, Transitions)
- Each card: thumbnail, title, category, "view" button

### 3. Portfolio (`/portfolio`)
- Larger case-study style layout
- Featured projects with description, results, client name
- Lightbox on click

### 4. Team (`/team`)
- Animated grid of team member cards (photo, name, role)
- Each card links to `/team/[auto-generated-slug-from-name]`

### 5. Team Member Profile (`/team/$slug`)
Each member has their own page with:
- Hero with portrait, name, role
- Skills (tag chips)
- Bio (long form)
- Contact: phone number, email
- **Personal client reviews** section
- **Personal FAQ** accordion
- URL **automatically updates** when admin changes the name (slug regenerated)

### 6. Contact (`/contact`)
- Contact form (name, email, message)
- Agency email, phone, social links
- Animated map/illustration

## 🛠️ Admin Panel (`/admin` — no login)

Per your request, no login is required. **Important note:** this means anyone who knows the URL `/admin` can edit team members. To reduce risk, I'll add:
- A simple shared **passcode prompt** (one secret word stored as a secret) before showing the editor — you just type it once per browser. This is the lightest possible protection that still keeps your data safe from random visitors. If you truly want zero gate, say the word and I'll remove it.

Admin features:
- List all team members
- **Add new member** (name, role, photo upload, phone, email, bio, skills, reviews list, FAQ list)
- **Edit existing member** — every field editable: name, photo, role, phone, email, bio, skills, reviews, FAQ
- **Delete member**
- Manage **agency-wide reviews** and **agency-wide FAQ** too
- When name changes → URL slug auto-regenerates and updates everywhere

## 🗄️ Backend (Lovable Cloud)

Tables:
- `team_members` — name, slug (auto), role, photo_url, phone, email, bio, skills (array), display_order
- `team_reviews` — member_id, reviewer_name, rating, comment
- `team_faqs` — member_id, question, answer
- `agency_reviews` — reviewer_name, rating, comment
- `agency_faqs` — question, answer
- `contact_messages` — submissions from contact form
- Storage bucket for team photos

All public-readable (so the site displays content); admin write access gated by the shared passcode.

## 🤖 AI-Generated Content

I'll generate with AI:
- All written copy (hero text, service descriptions, FAQs, sample reviews, bios) — full English, international tone
- Cinematic hero/background images
- Sample template thumbnails for "Our Work" and "Portfolio"
- Sample team member portraits as placeholders
- Agency logo/wordmark for "CapThemeStudio"

## ✨ Polish

- Fully responsive (mobile, tablet, desktop)
- SEO meta tags per page (title, description, og:image)
- Smooth page transitions
- 404 + error pages styled to match
- Site-wide cinematic header (logo + nav) and footer (links + socials)

---

After you approve, I'll build it in this order: design system & layout → home → team + team profile pages → other pages → admin panel → AI content & images → polish.
