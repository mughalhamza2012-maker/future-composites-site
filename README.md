# Future Composites website

The Future Composites website, served by GitHub Pages at www.future-composites.com (see `CNAME`). The 11 main pages are open to search engines; `demo/`, `home.html` and `thanks.html` stay hidden (noindex and `robots.txt`). The quote form on `get-a-quote.html` sends requests to Hamza's email through FormSubmit.

- Pages: one `.html` file per page; `index.html` is the home page.
- Photos: `images/`
- Published with GitHub Pages from the `main` branch. Every change pushed to `main` goes live on the test link in about a minute.

## Design demo
`demo/` is a one-page design demo: dark carbon-weave theme, glowing honeycomb hero, an interactive 3D rotor (three.js) and a scroll-animated process (GSAP). Libraries are stored in `demo/vendor/` so the page works offline.

## Mixed look (2026-11-25)
All 11 pages use `assets/mix.css` and `assets/mix.js` (glass menu with phone menu, carbon honeycomb heroes, orange keyword band, blueprint sections, photo zoom, footer). Home has the 3D rotor (`assets/rotor.js`); Materials has the material picker.
