# My Playlist — Setup Guide

## Folder structure
```
music-player/
├── index.html
├── style.css
├── script.js
├── songs.js          <-- you only need to edit this file
├── songs/            <-- put your 30 .mp3 files here (10 per mood)
│   └── (your mp3 files go here)
└── covers/           <-- optional album art images go here
    └── placeholder.jpg
```

## Your playlist now has 3 mood categories
- **Rock** — 10 songs
- **Sad** — 10 songs
- **Romantic** — 10 songs

All three show on one scrollable page. Click a mood pill near the top of
the playlist to smooth-scroll straight to that section.

## Steps to add your songs

1. **Copy your mp3 files** into the `songs` folder — any filename works,
   just avoid spaces (use hyphens or underscores instead).

2. **(Optional) Copy cover art images** into the `covers` folder.

3. **Open `songs.js`** — you'll see three lists: `rock`, `sad`, and
   `romantic`, each with 10 song slots. Edit each entry to match your
   actual files:
   ```js
   { file: "songs/highway-to-hell.mp3", cover: "covers/acdc.jpg", title: "Highway to Hell", artist: "AC/DC" }
   ```
   Repeat for all 30 slots across the three categories.

4. **Run it.** Right-click `index.html` in VS Code → "Open with Live Server",
   or double-click `index.html` to open it in your browser.

## What's already working
- Play / pause / next / previous, shuffle, repeat
- Click-to-seek waveform progress bar
- Volume control
- Search box that filters across all 3 categories at once
- Mood pills that jump-scroll to each section
- Each mood section has its own accent color and tagline

## Customizing
- **Mood colors/taglines**: edit the `accent` and `tagline` values at the
  top of each category block in `songs.js`.
- **Overall site colors**: edit the CSS variables at the top of `style.css`.

