# Prajwal Rai — Portfolio

## File Structure

```
portfolio/
├── index.html              ← Main HTML (all sections)
├── css/
│   ├── style.css           ← Core styles (layout, components, responsive)
│   └── animations.css      ← Scroll animations, transitions, keyframes
├── js/
│   └── main.js             ← Navbar, scroll effects, form, IntersectionObserver
├── images/                 ← (create this folder)
│   └── profile.jpg         ← Add your profile photo here
├── cv/                     ← (create this folder)
│   └── Prajwal_Rai_CV.pdf  ← Add your CV PDF here
└── README.md
```

## How to add your profile photo

In `index.html`, find the `.profile-frame` div and replace:
```html
<div class="profile-placeholder">
  <i class="fas fa-user"></i>
  <span>Prajwal Rai</span>
</div>
```
with:
```html
<img src="images/profile.jpg" alt="Prajwal Rai" style="width:100%;height:100%;object-fit:cover;" />
```

## How to deploy
- Upload all files to any static host: GitHub Pages, Netlify, Vercel, etc.
- No build step required — pure HTML/CSS/JS.

## Tech used
- Fonts: Syne (headings) + DM Sans (body) via Google Fonts
- Icons: Font Awesome 6
- Animations: CSS keyframes + IntersectionObserver API
