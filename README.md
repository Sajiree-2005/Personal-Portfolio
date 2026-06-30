# Sajiree Damle — Portfolio Website

A futuristic, deep purple/blue themed personal portfolio site.

## How to use
1. Unzip this folder.
2. Open `index.html` in any browser — that's it, no build step needed.
3. To host it for free, drag the whole folder into [Netlify Drop](https://app.netlify.com/drop), or push it to a GitHub repo and enable GitHub Pages.

## Structure
- `index.html` — all page content
- `css/style.css` — all styling (colors, type, layout, animations)
- `js/main.js` — constellation background, typing effect, scroll reveals, animated counters, mobile nav

## Customizing
- Colors: edit the CSS variables at the top of `css/style.css` under `:root`
- Typing headline phrases: edit the `phrases` array in `js/main.js`
- Add your photo: drop an image into a new `assets/` folder and reference it in `index.html` where you'd like (e.g. near the About section)
- Resume PDF: if you want a "Download Resume" button, add your PDF to the project folder and link a button to it, e.g. `<a href="Sajiree_Resume.pdf" download class="btn btn-ghost">Download Resume</a>`

## Notes
- Fonts (Space Grotesk, Inter, Space Mono) load from Google Fonts — needs an internet connection.
- Fully responsive down to mobile, respects reduced-motion preferences, and has visible keyboard focus states.
