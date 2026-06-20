# My Playlist — Setup Guide

## Folder structure
```
music-player/
├── index.html
├── style.css
├── script.js
├── songs.js          
├── songs/            
│   └──  mp3  
└── covers/            
    └── covers
```

##  playlist now has 3 mood categories
- **Rock**  
- **Sad**  
- **Romantic**  

All three show on one scrollable page. Click a mood pill near the top of
the playlist to smooth-scroll straight to that section.

 

## What's already working
- we can create our own playlist 
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

