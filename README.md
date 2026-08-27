# foliobyseann

My personal portfolio site built with React, Framer Motion, and Tailwind.

Live site: [foliobyseann.vercel.app](https://foliobyseann.vercel.app)

---

## What this is

I wanted a portfolio that doesn't look like another generic template. 

The site is built as a single continuous scroll experience where each section wipes in using clip-path masks and spring physics. No multi-page navigation or heavy router setups—just raw scroll timeline math tied to Framer Motion values.

If you need someone who follows instructions well but also flags the dumb step nobody's questioned yet, hire me.

---

## Tech Stack

- **React 19 + TypeScript (Vite)** — fast builds, strictly typed.
- **Framer Motion 12** — handles the scroll progress (`scrollYProgress` mapped from `0` to `1`), spatial clip-path transitions, and parallax mouse tracking.
- **Tailwind CSS v4** — high-contrast black and white brutalist layout.

---

## What's in here

- **The Scroll Timeline**: 11 layers tied to one master scroll container (`h-[2600vh]`). Moving down interpolates clip paths (`inset()`), coordinates, and opacities so sections wipe cleanly across the screen.
- **Experience Dossiers**: Breakdowns of past work across Flatworld / Flinn Scientific, INFLXD, Alorica / Google Fi Wireless, and Concentrix / Macy's.
- **Case Study Modal**: An interactive breakdown of the 8,000-SKU automation project where I used Claude MCP scraping, TypeScript Office Scripts, and VBA to finish 4 months ahead of schedule.
- **Spreadsheet Background Texture**: Parses real catalog JSON data and scrolls it infinitely in the background without tanking browser performance.

---

## Local Setup

```bash
# Clone the repo
git clone https://github.com/seannkai/foliobyseann.git

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## Contact

- **Email**: [seanntheuser@gmail.com](mailto:seanntheuser@gmail.com)
- **LinkedIn**: [linkedin.com/in/seannkai](https://linkedin.com/in/seannkai)
- **GitHub**: [github.com/seannkai](https://github.com/seannkai)
- **Instagram**: [instagram.com/seannkai](https://instagram.com/seannkai)
