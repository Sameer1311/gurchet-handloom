# Gurchet Handloom: website

Animated, mobile-first website for a handloom shop in Tarn Taran, Punjab. Customers browse products, design their own woven pattern, and send orders straight to the shop on WhatsApp.

**Stack:** React 19 · Vite · Tailwind CSS 4 · Motion (Framer Motion) · Lenis smooth scroll · Lucide icons

## Features

- **Live weave designer.** Pick a pattern (checks, stripes or border), three colours, stripe width, size and quantity, and see real over-under threads in an SVG preview. Send the design on WhatsApp.
- **Enquiry list.** Add several products (with colour and quantity) and send them all in one WhatsApp message. The list is saved in localStorage.
- **Product catalogue** with category filter, live search, quick-view popup with colour recolouring, and shareable links (`?p=khes`).
- **Wholesale form** with validation that builds a complete WhatsApp enquiry.
- **Animations:** preloader, a loom that weaves itself in the hero, word reveals, magnetic buttons, 3D tilt cards, parallax, a sideways "Shop by occasion" section, a scroll-linked "How it's made" timeline, and a marquee.
- Live **"Open now"** badge (IST), Google Map, FAQ accordion. Respects reduced-motion settings.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

## Customise

- `src/config.js`: shop name, WhatsApp number, opening hours, map location
- `src/data.js`: products, colours, process steps, FAQs
- Product images: patterns are CSS placeholders (`.pat-*` in `src/index.css`) until real photos are added.

Built by [Sameer Negi](https://github.com/Sameer1311).
