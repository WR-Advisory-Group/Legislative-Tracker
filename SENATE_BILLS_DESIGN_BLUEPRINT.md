# Design Blueprint: senate.gov.ph/legislative-documents/bills

> Extracted 2026-04-15 via Playwright deep scan. This document covers the Bills listing page,
> its inline search bar, the Advanced Filters slide-out panel, and the floating search modal.

---

## 1. Design Tokens

### 1.1 Color Palette

#### Primary Colors (Government Red - Header/Banner)
| Token               | Value                  | Hex       | Usage                          |
|----------------------|------------------------|-----------|--------------------------------|
| `red-900`           | `rgb(111, 10, 21)`    | `#6F0A15` | Nav gradient start             |
| `red-700`           | `rgb(171, 31, 35)`    | `#AB1F23` | Nav gradient midpoint          |
| `red-600`           | Tailwind `red-700`     | —         | Nav gradient end               |
| `red-error`         | `rgb(185, 28, 28)`    | `#B91C1C` | Error / destructive text       |
| `red-light-bg`      | `rgb(254, 202, 202)`  | `#FECACA` | "Learn More" badge background  |
| `red-dark-text`     | `rgb(153, 27, 27)`    | `#991B1B` | "Learn More" badge text        |

#### Secondary Colors (Blue - Interactive/Data)
| Token               | Value                  | Hex       | Usage                          |
|----------------------|------------------------|-----------|--------------------------------|
| `blue-800`          | `rgb(30, 64, 175)`    | `#1E40AF` | Table header bg                |
| `blue-700`          | `rgb(29, 78, 216)`    | `#1D4ED8` | Labels, link text, gradient start |
| `blue-600`          | `rgb(37, 99, 235)`    | `#2563EB` | Primary buttons, active links  |
| `blue-500`          | `rgb(59, 130, 246)`   | `#3B82F6` | "View PDF" link color          |
| `blue-200`          | `rgb(191, 219, 254)`  | `#BFDBFE` | Input borders                  |
| `blue-100`          | `rgb(219, 234, 254)`  | `#DBEAFE` | Table divider lines            |
| `blue-50`           | `rgb(239, 246, 255)`  | `#EFF6FF` | Input backgrounds (inline), alternating row bg |
| `blue-900-text`     | `rgb(30, 58, 138)`    | `#1E3A8A` | Input text / select text       |

#### Neutral Colors
| Token               | Value                  | Hex       | Usage                          |
|----------------------|------------------------|-----------|--------------------------------|
| `gray-900`          | `rgb(17, 24, 39)`     | `#111827` | Body text, footer bg           |
| `gray-800`          | `rgb(15, 23, 42)`     | `#0F172A` | Section headers (slate-900)    |
| `gray-700`          | `rgb(51, 65, 85)`     | `#334155` | Secondary button text (slate-700) |
| `gray-600`          | `rgb(55, 65, 81)`     | `#374151` | Table cell text                |
| `gray-500`          | `rgb(75, 85, 99)`     | `#4B5563` | Muted text                     |
| `gray-400`          | `rgb(107, 114, 128)`  | `#6B7280` | Placeholder text               |
| `gray-300`          | `rgb(156, 163, 175)`  | `#9CA3AF` | Disabled / close icon          |
| `gray-200`          | `rgb(209, 213, 219)`  | `#D1D5DB` | Borders                        |
| `gray-100`          | `rgb(243, 244, 246)`  | `#F3F4F6` | Hamburger bg, icon button bg   |
| `white`             | `rgb(255, 255, 255)`  | `#FFFFFF` | Page bg, card bg, button bg    |

### 1.2 Typography

| Element   | Font Family              | Size   | Weight | Line-Height | Letter-Spacing | Transform  | Color               |
|-----------|--------------------------|--------|--------|-------------|----------------|------------|----------------------|
| `h1`      | **Canterbury, serif**    | 30px   | 400    | 36px        | normal         | none       | white (banner)       |
| `h2`      | Inter, system-ui, sans   | 30px   | 700    | 36px        | normal         | none       | white                |
| `h3`      | Inter, system-ui, sans   | 14px   | 700    | 20px        | 0.35px         | UPPERCASE  | slate-900            |
| `h4`      | Inter, system-ui, sans   | 16px   | 500    | 24px        | normal         | none       | white                |
| `th`      | Inter, system-ui, sans   | 16px   | 700    | 24px        | 0.8px          | UPPERCASE  | white                |
| `td`      | Inter, system-ui, sans   | 14px   | 600    | 20px        | normal         | none       | blue-900 / gray-600  |
| `label`   | Inter, system-ui, sans   | 14px   | 600    | 20px        | normal         | none       | blue-700             |
| `p`       | Inter, system-ui, sans   | 20px   | 400    | 28px        | normal         | none       | varies               |
| `body`    | Inter, system-ui, sans   | 16px   | 400    | 24px        | normal         | none       | gray-900             |
| `span`    | Inter, system-ui, sans   | 12px   | 600    | 16px        | normal         | none       | varies               |

> **Key Insight**: The site uses **Canterbury (serif)** exclusively for the page title (`h1` in the banner).
> Everything else is **Inter** with `system-ui, sans-serif` as fallback. The brand identity relies on
> Canterbury for ceremony/authority and Inter for readability.

### 1.3 Spacing Units (Tailwind-based)

| Token   | Value  | Usage Examples                                      |
|---------|--------|-----------------------------------------------------|
| `p-2`   | 8px    | Icon buttons, close button                          |
| `p-2.5` | 10px   | Advanced filter inputs (py)                         |
| `p-3`   | 12px   | Button py, search button py                         |
| `p-4`   | 16px   | Inline search inputs, table cell padding, button px |
| `p-6`   | 24px   | Modal header px, search button px, nav px (sm)      |
| `p-12`  | 48px   | Footer py                                           |
| `px-20` | 80px   | Nav horizontal padding (lg)                         |
| `gap-3` | 12px   | Logo + text group gap                               |
| `gap-8` | 32px   | Nav items gap                                       |
| `gap-12`| 48px   | Nav items gap (lg)                                  |

---

## 2. Layout Structure

### 2.1 Framework
- **CSS Framework**: Tailwind CSS (utility-first classes throughout)
- **Layout Engine**: **Flexbox** exclusively — no CSS Grid detected on this page
- **No CSS custom properties** (`:root` vars) — all values come from Tailwind's config

### 2.2 Page Architecture

```
┌─────────────────────────────────────────────────────────┐
│  NAV (sticky top-0 z-50)                                │
│  gradient: from-[#6F0A15] via-[#AB1F23] to-red-700     │
│  backdrop-blur-md, shadow-2xl                           │
│  px: 24px (sm) → 80px (lg)                              │
├─────────────────────────────────────────────────────────┤
│  BANNER / HERO                                          │
│  Same red gradient bg, contains:                        │
│    H1 "Bills" (Canterbury serif, 30px, white)           │
│    Decorative divider (blue line ★★★ dark line)         │
├─────────────────────────────────────────────────────────┤
│  SEARCH BAR SECTION (white bg, padded card)             │
│  flex row: [Congress select] [Type select] [Search      │
│  input] [Search button]                                 │
│  + "Advanced Filters" toggle below                      │
├─────────────────────────────────────────────────────────┤
│  DATA TABLE                                             │
│  table-auto border-collapse divide-y divide-blue-100    │
│  THEAD: bg-blue-800, white uppercase text               │
│  TBODY: alternating white / blue-50 rows                │
│    hover:bg-blue-100, cursor-pointer                    │
│    transition-colors duration-150                       │
├─────────────────────────────────────────────────────────┤
│  FOOTER (bg-gray-900, text-white, py-12)                │
└─────────────────────────────────────────────────────────┘
```

### 2.3 Container Widths
| Viewport    | Behavior                                              |
|-------------|-------------------------------------------------------|
| Desktop     | Content ~1036px wide (no explicit max-width, flex-1)  |
| Tablet 768  | Full width, padding-based containment                 |
| Mobile 375  | Full width (360px content), stacked layout             |

### 2.4 Nav Structure
- **Desktop (sm+)**: `flex w-full justify-between` — logo left, nav links center, congress badge right
- **Second nav row**: White bg, `sticky top-0 z-50`, contains menu links and hamburger
- **Mobile (<sm)**: First nav hidden (`hidden sm:flex`), hamburger menu visible

---

## 3. Component Patterns

### 3.1 Inline Search Bar (Main Page)

```
┌──────────────────┬──────────┬─────────────────────────┬──────────────┐
│ Congress [select]│ Type [v] │ Search by Bill No...     │ 🔍 Search   │
└──────────────────┴──────────┴─────────────────────────┴──────────────┘
                                                   ▽ Advanced Filters
```

| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Layout          | `flex` row, wraps to column on mobile      |
| Input bg        | `bg-blue-50` (#EFF6FF)                     |
| Input border    | `0.8px solid` blue-200 (#BFDBFE)           |
| Input radius    | `8px` (rounded-lg)                         |
| Input padding   | `16px` all sides                           |
| Input height    | ~57px                                      |
| Input font      | Inter 16px, color blue-900 (#1E3A8A)       |
| Input focus     | `focus:outline-none` (custom focus ring)   |
| Search button   | Gradient `from-blue-600 to-blue-700`       |
| Button padding  | `12px 24px`                                |
| Button radius   | `8px`                                      |
| Button text     | White, 16px, font-weight 600               |
| Button hover    | `from-blue-700 to-blue-800`                |
| Button shadow   | Subtle box-shadow on hover                 |

### 3.2 Advanced Filters Panel (Slide-out Drawer)

| Property          | Value                                                  |
|-------------------|--------------------------------------------------------|
| Position          | `fixed top-0 left-0`, full height                      |
| Width             | `w-2/3` (~66.67% of viewport, ~680px at 1024)         |
| Background        | Gradient `from-slate-50 to-slate-100`                  |
| Shadow            | `shadow-2xl` (0px 25px 50px -12px rgba(0,0,0,0.25))   |
| Z-index           | `50`                                                   |
| Overflow          | `overflow-y-auto`                                      |
| Animation         | `transform transition-transform duration-300 ease-out` |
| Entry animation   | `translate-x-0` (slides from left via translateX)      |

#### Panel Header
| Property    | Value                                              |
|-------------|----------------------------------------------------|
| Background  | Gradient `from-blue-700 to-blue-800` (#1D4ED8→#1E40AF) |
| Text        | "Filters" — white, 18px, font-weight 700           |
| Close icon  | White, `p-2 rounded-lg hover:bg-blue-600`          |

#### Filter Fields (8 total)
| Field                  | Input Type | Notes                           |
|------------------------|------------|---------------------------------|
| Bill No. / Title       | `INPUT`    | Text search                     |
| Congress               | `SELECT`   | Dropdown                        |
| Type                   | `SELECT`   | Dropdown                        |
| Author / Sponsor       | `SELECT`   | Dropdown                        |
| Primary Committee      | `SELECT`   | Dropdown                        |
| Legislative Status     | `SELECT`   | Dropdown                        |
| Sort By                | `SELECT`   | Dropdown                        |
| Sort Order             | `BUTTON`   | Toggle (Ascending/Descending ↑↓)|

#### Filter Input Styling (inside panel)
| Property        | Value                                      |
|-----------------|--------------------------------------------|
| Background      | `bg-white` (#FFFFFF) — NOT blue-50          |
| Border          | `1.6px solid` blue-200 (#BFDBFE)           |
| Radius          | `8px`                                      |
| Padding         | `10px 16px`                                |
| Height          | ~47px                                      |
| Label color     | blue-700 (#1D4ED8), 14px, font-weight 600  |

#### Section Header
- Text: "DOCUMENT FILTERS"
- Style: `h3`, 14px, 700 weight, slate-900, uppercase, letter-spacing 0.35px

#### Panel Buttons
| Button            | Style                                                        |
|-------------------|--------------------------------------------------------------|
| **Apply Filters** | Full-width, gradient `from-blue-600 to-blue-700`, white text, rounded-lg, py-3 px-4, font-semibold |
| **Download Report** | Full-width, `bg-white`, `border-2 border-slate-300`, slate-700 text, font-semibold |
| **Reset All Filters** | Same as Download Report (outlined secondary style)       |

### 3.3 Data Table

| Property               | Value                                               |
|------------------------|-----------------------------------------------------|
| Class                  | `w-full table-auto border-collapse divide-y divide-blue-100` |
| Width                  | 100% of container (~938px at desktop)               |
| Mobile overflow        | Parent has `overflow-x-auto max-w-full`             |

#### Table Header (`<thead>`)
| Property       | Value                            |
|----------------|----------------------------------|
| Background     | `bg-blue-800` (#1E40AF)          |
| Text color     | White                            |
| Font           | 16px, 700 weight, uppercase      |
| Letter-spacing | 0.8px                            |
| Padding        | `12px 24px`                      |
| Text-align     | Left                             |

#### Columns
| Column          | Desktop Width | Purpose                     |
|-----------------|---------------|-----------------------------|
| TYPE            | ~82px         | "House Bill" / "Senate Bill"|
| BILL NO.        | ~82px         | e.g. "HBN-8477"            |
| TITLE / SUBJECT | ~flex-1       | Title + description + meta  |
| ACTION          | ~144px        | Learn More / View PDF       |

#### Table Rows
| Property              | Value                                     |
|-----------------------|-------------------------------------------|
| Even rows             | `bg-white` (#FFFFFF)                      |
| Odd rows              | `bg-blue-50` (#EFF6FF)                   |
| Hover                 | `hover:bg-blue-100`, cursor-pointer       |
| Transition            | `transition-colors duration-150`          |
| Cell padding          | `16px`                                    |
| Cell font             | 14px, weight 600                          |
| Cell vertical-align   | `middle`                                  |
| Type column color     | blue-900 (#1E3A8A)                        |
| Bill No. column color | blue-700 (#1D4ED8)                        |
| Title column color    | gray-600 (#374151)                        |

#### Row Content Structure (TITLE/SUBJECT cell)
```
BILL TITLE (bold, uppercase, blue-900 link)
Full description text (gray-600, 14px)
Filed: [date] (smaller, muted)
Primary Committee: [NAME] (smaller, muted)
Secondary Committee: [NAME] (smaller, muted)
```

### 3.4 Action Buttons (in table cells)

#### "Learn More" Badge
| Property    | Value                                          |
|-------------|------------------------------------------------|
| Background  | `bg-red-100` (#FECACA)                         |
| Text color  | red-800 (#991B1B)                              |
| Radius      | Rounded (pill-like)                            |
| Font        | Small, with info icon (ⓘ)                      |
| Interaction | Links to bill detail page                      |

#### "View PDF" Link
| Property       | Value                              |
|----------------|------------------------------------|
| Display        | `flex` row with gap-1              |
| Color          | blue-500 (#3B82F6)                 |
| Hover          | `hover:text-blue-700`              |
| Font size      | 14px (sm), 10px (mobile)          |
| Icon           | PDF document icon (SVG)            |
| Decoration     | None (no underline)                |

### 3.5 Floating Search Modal (Chatbot-triggered)

| Property        | Value                                        |
|-----------------|----------------------------------------------|
| Container       | `fixed inset-0 z-[1000]`, flex center        |
| Backdrop        | Semi-transparent overlay                     |
| Card            | `bg-white rounded-2xl shadow-2xl`            |
| Card width      | `768px`                                      |
| Card radius     | `16px` (rounded-2xl)                         |
| Card shadow     | `shadow-2xl` (25px 50px -12px)               |
| Header          | Gradient `from-blue-700 to-blue-800`, white text |
| Header padding  | `16px 24px`                                  |
| Close button    | White X in header bar                        |
| Body            | Contains Document Type, Bill Type, Sort dropdowns + search input |

### 3.6 Navigation Bar

#### Primary Nav (Red Gradient)
| Property        | Value                                           |
|-----------------|-------------------------------------------------|
| Background      | `gradient from-[#6F0A15] via-[#AB1F23] to-red-700` |
| Blur            | `backdrop-blur-md`                              |
| Shadow          | `shadow-2xl shadow-gray-600`                    |
| Position        | `sticky top-0 z-50`                             |
| Border          | `border-b` (bottom border)                      |
| Logo font       | Canterbury serif (brand masthead)               |
| Padding         | `sm:px-6 lg:px-20`                              |

#### Secondary Nav (White)
| Property        | Value                                           |
|-----------------|-------------------------------------------------|
| Background      | `bg-white backdrop-blur-md`                     |
| Position        | `sticky top-0 z-50`                             |
| Padding         | `px-4 sm:px-6 lg:px-8`                          |
| Height          | ~64px                                           |

### 3.7 Hamburger / Mobile Menu Button
| Property       | Value                                     |
|----------------|-------------------------------------------|
| Background     | `bg-gray-100` (#F3F4F6)                   |
| Radius         | `8px` (rounded-lg)                        |
| Padding        | `10px` (p-2.5)                            |
| Icon color     | `text-white/90`                           |
| Hover          | `hover:text-gray-800 hover:bg-gradient`   |

### 3.8 Footer
| Property       | Value                              |
|----------------|------------------------------------|
| Background     | `bg-gray-900` (#111827)            |
| Text color     | White                              |
| Padding        | `py-12` (48px vertical)            |
| Font           | Inter, system-ui, sans-serif       |

### 3.9 Chatbot FAB (Floating Action Button)
| Property       | Value                                      |
|----------------|--------------------------------------------|
| Shape          | Circle (`rounded-full`)                    |
| Size           | `w-12 h-12` (sm: `w-16 h-16`)             |
| Background     | Gradient `from-blue-600 to-blue-700`       |
| Color          | White icon                                 |
| Position       | Fixed, bottom-right corner                 |
| Shadow         | Box-shadow present                         |
| Z-index        | High (above content)                       |

---

## 4. Responsive Logic

### 4.1 Tailwind Breakpoints Used
The page uses standard Tailwind breakpoints detected via class scanning:

| Prefix | Min-Width | Usage                                            |
|--------|-----------|--------------------------------------------------|
| `sm`   | 640px     | Nav visibility, flex-row, text sizes, input sizes |
| `md`   | 768px     | Grid cols, flex layout, text scaling, visibility  |
| `lg`   | 1024px    | Nav padding (px-20), gap-12, flex-row             |
| `xl`   | 1280px    | Flex visibility toggles                           |

### 4.2 Breakpoint Behavior Matrix

| Component           | Mobile (<640)              | Tablet (640-1023)           | Desktop (1024+)             |
|---------------------|----------------------------|-----------------------------|-----------------------------|
| **Primary Nav**     | Hidden (`hidden sm:flex`)  | Visible, `px-6`             | Visible, `px-20`            |
| **Hamburger**       | Visible                    | Visible (hamburger persists)| Visible (hamburger persists)|
| **Search Form**     | Stacked column, full-width | Row layout, condensed       | Row layout, spacious        |
| **Congress select** | Hidden (in adv. filters)   | Visible, ~220px             | Visible, ~284px             |
| **Type select**     | Hidden (in adv. filters)   | Visible, ~80px              | Visible, ~127px             |
| **Search Input**    | Full width                 | Flex-1                      | Flex-1 (~367px)             |
| **Search Button**   | Full width, below inputs   | Inline, `px-6 py-3`        | Inline, `px-6 py-3`        |
| **Adv. Filters btn**| Full width, outlined       | Inline, text-only           | Inline, text-only           |
| **Data Table**      | `overflow-x-auto` scroll   | Full width, all 4 cols      | Full width, all 4 cols      |
| **Table columns**   | All visible but compressed | All visible                 | All visible                 |
| **Filter Panel**    | `w-2/3` slide-out          | `w-2/3` slide-out           | `w-2/3` slide-out           |
| **Chatbot FAB**     | `w-12 h-12`               | `w-16 h-16`                 | `w-16 h-16`                 |
| **Footer**          | Stacked                    | Flex layout                 | Flex layout                 |

### 4.3 Key Responsive Patterns
1. **Mobile-first stacking**: Search inputs stack vertically; Congress and Type selects are moved into the Advanced Filters panel on mobile
2. **Horizontal table scroll**: Table maintains all 4 columns at all sizes but uses `overflow-x-auto` wrapper on mobile
3. **Nav collapse**: Primary red nav is hidden below `sm` breakpoint; only the white secondary nav with hamburger remains
4. **Slide-out drawer**: The Advanced Filters panel is always a fixed left-side drawer (`w-2/3`), regardless of viewport
5. **Text scaling**: Action links use `text-[10px] sm:text-sm` for responsive font sizing

---

## 5. Interaction & Animation Tokens

| Element              | Trigger | Effect                                          |
|----------------------|---------|-------------------------------------------------|
| Table rows           | Hover   | `bg-blue-100`, `transition-colors duration-150` |
| Search button        | Hover   | Gradient shifts to `from-blue-700 to-blue-800`  |
| Search button        | Active  | `active:scale-95`                               |
| Advanced Filters btn | Hover   | `hover:bg-slate-50`, `hover:shadow-sm`          |
| Advanced Filters btn | Active  | `active:scale-95`                               |
| Filter panel         | Open    | `translateX(0)`, `transition-transform duration-300 ease-out` |
| Filter panel         | Close   | `translateX(-100%)` (slides left off-screen)    |
| Nav                  | Scroll  | `transition-all duration-700 ease` (sticky behavior) |
| View PDF link        | Hover   | `hover:text-blue-700`                           |
| Hamburger button     | Hover   | `hover:text-gray-800 hover:bg-gradient-to-r`    |
| Panel buttons        | Hover   | `hover:bg-slate-50` (secondary), gradient shift (primary) |

---

## 6. Data Loading Pattern

| Aspect             | Observed Behavior                                |
|--------------------|--------------------------------------------------|
| Pagination         | **None detected** — no pagination controls found |
| Infinite scroll    | **Not detected** — no observer/infinite classes  |
| Load strategy      | Appears to load all bills at once (body height ~10,866px) |
| Total page height  | ~10,866px (significant vertical scroll)          |

> **Note**: The page loads all results in a single long-scroll table. No pagination
> or lazy-loading was detected. This is an important UX consideration for replication.

---

## 7. Technology Stack Summary

| Layer       | Technology                            |
|-------------|---------------------------------------|
| CSS         | **Tailwind CSS** (utility classes)    |
| Fonts       | **Inter** (body) + **Canterbury** (brand h1) |
| Layout      | **Flexbox** only (no CSS Grid)        |
| Icons       | Inline SVG icons                      |
| Animations  | Tailwind transition utilities         |
| Framework   | **React 18+** (client-side SPA, `createRoot` API, `<div id="root">`) |
| Build Tool  | **Vite** (content-hashed bundles: `index-BPltjk4L.js`)              |
| CDN         | **Cloudflare** (Insights beacon + CF challenge iframe)               |
| Chatbot     | Floating modal triggered by FAB       |
