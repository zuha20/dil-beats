/* ===================================================================
   STATE
   =================================================================== */
let currentIndex = -1; // -1 = nothing picked yet
let isPlaying = false;
let isShuffle = false;
let repeatMode = "off"; // "off" | "all" | "one"
let activeSearchQuery = "";
let activeMood = null; // null = no mood picked yet, nothing should render

// Which list next/prev should advance through: the song's own mood category,
// or — if it was started from My Playlist — the favorites list instead.
// { type: "category", id: <categoryId> } | { type: "myPlaylist" }
let playbackContext = { type: "category", id: songCategories[0].id };

/* ===================================================================
   PERSONAL PLAYLIST (saved per-visitor in their own browser only)
   =================================================================== */
const FAVORITES_KEY = "myPlaylist_favorites";

function getFavoriteKeys() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

function songKey(song) {
  if (!song.categoryId) {
    console.error("songKey() called with a song missing categoryId — favorite will not save correctly:", song);
  }
  return `${song.categoryId}::${song.file}`;
}

function isFavorite(song) {
  return getFavoriteKeys().includes(songKey(song));
}

function toggleFavorite(song) {
  const keys = getFavoriteKeys();
  const key = songKey(song);
  const idx = keys.indexOf(key);
  if (idx === -1) {
    keys.push(key);
  } else {
    keys.splice(idx, 1);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(keys));
}

function getFavoriteSongs() {
  const allKeys = getFavoriteKeys();
  const validKeys = [];
  const resolved = [];

  allKeys.forEach(key => {
    const match = songs.find(s => songKey(s) === key);
    if (match) {
      validKeys.push(key);
      resolved.push(match);
    }
    // if no match, this key is orphaned (song was renamed/moved/removed) — drop it
  });

  // keep storage in sync so the count badge never disagrees with what's shown
  if (validKeys.length !== allKeys.length) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(validKeys));
  }

  return resolved;
}

function getFavoriteCount() {
  return getFavoriteSongs().length;
}

const audio = document.getElementById("audio");
const categorySections = document.getElementById("categorySections");
const moodPills = document.getElementById("moodPills");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const volumeSlider = document.getElementById("volumeSlider");
const searchInput = document.getElementById("searchInput");

const npTitle = document.getElementById("np-title");
const npArtist = document.getElementById("np-artist");
const art = document.getElementById("art");
const artWrap = document.getElementById("artWrap");
const artEmptyState = document.getElementById("artEmptyState");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const scrubber = document.getElementById("scrubber");
const progressMask = document.getElementById("progressMask");
const playhead = document.getElementById("playhead");
const waveform = document.getElementById("waveform");

/* ===================================================================
   WAVEFORM (signature visual element)
   =================================================================== */
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildWaveform(seed) {
  const rand = seededRandom(seed || 1);
  const bars = 46;
  const gap = 3;
  const barWidth = (600 - gap * (bars - 1)) / bars;
  let rects = "";
  for (let i = 0; i < bars; i++) {
    const h = 14 + (rand() * 0.5 + rand() * 0.5) * 36;
    const y = (60 - h) / 2;
    const x = i * (barWidth + gap);
    rects += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${h.toFixed(1)}" rx="2" />`;
  }
  waveform.innerHTML = rects;
  progressMask.innerHTML = `<svg viewBox="0 0 600 60" preserveAspectRatio="none" width="600">${rects.replace(/\/>/g, ' fill="var(--accent)"/>')}</svg>`;
}

/* ===================================================================
   RENDER MOOD PILLS (tabs — only one mood visible at a time)
   =================================================================== */
const MOOD_ICONS = {
  rock: "&#127928;",       // 🎸
  sad: "&#127783;&#65039;", // 🌧️
  romantic: "&#128157;"     // 💕
};

function renderMoodPills() {
  const categoryPills = songCategories.map(cat => `
    <button class="mood-card${cat.id === activeMood ? " is-active" : ""}" data-mood="${cat.id}" style="--card-accent: ${cat.accent}">
      <span class="mood-card-icon">${cat.icon || MOOD_ICONS[cat.id] || "&#127925;"}</span>
      <span class="mood-card-label">${cat.label}</span>
      <span class="mood-card-tagline">${cat.tagline || ""}</span>
    </button>
  `).join("");

  const favCount = getFavoriteCount();
  const myPlaylistPill = `
    <button class="mood-pill mood-pill-fav${activeMood === "myPlaylist" ? " is-active" : ""}" data-mood="myPlaylist" style="--pill-accent: var(--accent)">
      &#9825; My Playlist${favCount > 0 ? ` (${favCount})` : ""}
    </button>
  `;

  moodPills.innerHTML = `<div class="mood-cards">${categoryPills}</div>${myPlaylistPill}`;

  moodPills.querySelectorAll(".mood-card, .mood-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      activeMood = pill.dataset.mood;
      renderMoodPills();
      renderCategorySections();
    });
  });
}

/* ===================================================================
   RENDER CATEGORY SECTIONS
   =================================================================== */
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function matchesSearch(song) {
  if (!activeSearchQuery) return true;
  const q = activeSearchQuery.toLowerCase();
  return song.title.toLowerCase().includes(q) || song.artist.toLowerCase().includes(q);
}

function renderCategorySections() {
  categorySections.innerHTML = "";

  // Home state: nothing picked yet — show a prompt instead of any song list
  if (activeMood === null) {
    categorySections.innerHTML = `
      <div class="mood-home-prompt">
        <p>Choose Rock, Sad, or Romantic above to see those songs.</p>
      </div>
    `;
    return;
  }

  // Special case: "My Playlist" — built from this visitor's saved favorites
  if (activeMood === "myPlaylist") {
    renderFavoritesSection();
    return;
  }

  const cat = songCategories.find(c => c.id === activeMood);
  if (!cat) return;

  const visibleSongs = cat.songs.filter(matchesSearch);

  const section = document.createElement("section");
  section.className = "mood-section";
  section.id = `section-${cat.id}`;
  section.style.setProperty("--section-accent", cat.accent);

  if (visibleSongs.length === 0) {
    section.innerHTML = `
      <div class="mood-section-header">
        <h3 class="mood-section-title">${cat.label}</h3>
        <p class="mood-section-tagline">${cat.tagline}</p>
      </div>
      <p class="no-results">No tracks match your search in ${cat.label}.</p>
    `;
    categorySections.appendChild(section);
    return;
  }

  section.innerHTML = `
    <div class="mood-section-header">
      <h3 class="mood-section-title">${cat.label}</h3>
      <p class="mood-section-tagline">${cat.tagline}</p>
    </div>
    <div class="track-list"></div>
  `;

  const list = section.querySelector(".track-list");

  visibleSongs.forEach(song => {
    const realIndex = songs.findIndex(s => s.file === song.file && s.categoryId === cat.id);
    const realSong = songs[realIndex]; // use the flattened object — it has categoryId, song doesn't
    list.appendChild(buildTrackRow(realSong, realIndex, cat.songs.indexOf(song) + 1, { type: "category", id: cat.id }));
  });

  categorySections.appendChild(section);
}

function renderFavoritesSection() {
  const favSongs = getFavoriteSongs().filter(matchesSearch);

  const section = document.createElement("section");
  section.className = "mood-section";
  section.id = "section-myPlaylist";
  section.style.setProperty("--section-accent", "var(--accent)");

  if (favSongs.length === 0) {
    section.innerHTML = `
      <div class="mood-section-header">
        <h3 class="mood-section-title">My Playlist</h3>
        <p class="mood-section-tagline">Saved only on this device — tap the heart on any song to add it here</p>
      </div>
      <p class="no-results">Nothing saved yet. Tap &#9825; next to a song to add it to your own playlist.</p>
    `;
    categorySections.appendChild(section);
    return;
  }

  section.innerHTML = `
    <div class="mood-section-header">
      <h3 class="mood-section-title">My Playlist</h3>
      <p class="mood-section-tagline">Saved only on this device — ${favSongs.length} song${favSongs.length === 1 ? "" : "s"}</p>
    </div>
    <div class="track-list"></div>
  `;

  const list = section.querySelector(".track-list");

  favSongs.forEach((song, i) => {
    const realIndex = songs.findIndex(s => songKey(s) === songKey(song));
    list.appendChild(buildTrackRow(song, realIndex, i + 1, { type: "myPlaylist" }));
  });

  categorySections.appendChild(section);
}

function buildTrackRow(song, realIndex, displayNumber, context) {
  const row = document.createElement("div");
  row.className = "track-row" + (realIndex === currentIndex ? " is-active" : "");

  row.innerHTML = `
    <span class="track-index">${realIndex === currentIndex && isPlaying ? "&#9835;" : displayNumber}</span>
    <img class="track-thumb" src="${song.cover}" alt="" onerror="this.src='covers/placeholder.jpg'" />
    <div class="track-meta">
      <p class="track-name">${song.title}</p>
      <p class="track-artist">${song.artist}</p>
    </div>
    <button class="fav-btn${isFavorite(song) ? " is-favorited" : ""}" title="Save to My Playlist" aria-label="Save to My Playlist">
      ${isFavorite(song) ? "&#9829;" : "&#9825;"}
    </button>
    <span class="track-duration" data-duration-for="${realIndex}">--:--</span>
  `;

  const playFromHere = () => {
    playbackContext = context;
    loadTrack(realIndex);
    playTrack();
  };

  row.querySelector(".track-meta").addEventListener("click", playFromHere);
  row.querySelector(".track-thumb").addEventListener("click", playFromHere);
  row.querySelector(".fav-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(song);
    renderMoodPills();
    renderCategorySections();
  });

  preloadDuration(song, realIndex);
  return row;
}

function preloadDuration(song, index) {
  const probe = new Audio();
  probe.preload = "metadata";
  probe.src = song.file;
  probe.addEventListener("loadedmetadata", () => {
    const el = document.querySelector(`[data-duration-for="${index}"]`);
    if (el) el.textContent = formatTime(probe.duration);
  });
  probe.addEventListener("error", () => {
    const el = document.querySelector(`[data-duration-for="${index}"]`);
    if (el) el.textContent = "—";
  });
}

/* ===================================================================
   PLAYER CORE
   =================================================================== */
function loadTrack(index) {
  currentIndex = index;
  const song = songs[index];
  audio.src = song.file;

  artEmptyState.style.display = "none";
  art.style.display = "block";
  art.classList.add("is-loading");
  const newArt = new Image();
  newArt.onload = () => {
    art.src = song.cover;
    art.classList.remove("is-loading");
  };
  newArt.onerror = () => {
    art.src = "covers/placeholder.jpg";
    art.classList.remove("is-loading");
  };
  newArt.src = song.cover;

  npTitle.textContent = song.title;
  npArtist.textContent = song.artist;

  buildWaveform(index + 1);
  progressMask.style.width = "0%";
  playhead.style.left = "0%";
  currentTimeEl.textContent = "0:00";
  renderCategorySections();
}

function showEmptyNowPlaying() {
  npTitle.textContent = "Select a track";
  npArtist.textContent = "—";
  art.style.display = "none";
  artEmptyState.style.display = "flex";
  waveform.innerHTML = "";
  progressMask.innerHTML = "";
}

function playTrack() {
  audio.play().catch(() => {
    npArtist.textContent = "Couldn't load this file — check the songs folder";
  });
  isPlaying = true;
  playIcon.style.display = "none";
  pauseIcon.style.display = "block";
  document.querySelector(".art-wrap").classList.add("is-playing");
  renderCategorySections();
}

function pauseTrack() {
  audio.pause();
  isPlaying = false;
  playIcon.style.display = "block";
  pauseIcon.style.display = "none";
  document.querySelector(".art-wrap").classList.remove("is-playing");
  renderCategorySections();
}

function togglePlay() {
  if (currentIndex === -1) {
    // nothing picked yet — the play button on its own shouldn't start anything
    return;
  }
  if (!audio.src) {
    loadTrack(currentIndex);
  }
  isPlaying ? pauseTrack() : playTrack();
}

function getCategorySongIndices(categoryId) {
  return songs
    .map((s, i) => ({ song: s, index: i }))
    .filter(item => item.song.categoryId === categoryId)
    .map(item => item.index);
}

function getFavoriteSongIndices() {
  // Index order here is the same order shown in My Playlist (favorite order).
  return getFavoriteSongs().map(song => songs.findIndex(s => songKey(s) === songKey(song)));
}

// Indices of the list we should be advancing through, based on what the
// person is currently playing from (a mood category, or My Playlist).
function getActivePlaybackIndices() {
  if (playbackContext.type === "myPlaylist") {
    const favIndices = getFavoriteSongIndices();
    // If the song was unfavorited mid-playback, fall back to its own category
    // instead of advancing through an empty/stale list.
    if (favIndices.includes(currentIndex)) return favIndices;
    return getCategorySongIndices(songs[currentIndex].categoryId);
  }
  return getCategorySongIndices(playbackContext.id);
}

function isLastInCategory(index) {
  const activeIndices = getActivePlaybackIndices();
  return activeIndices[activeIndices.length - 1] === index;
}

function nextTrack() {
  const activeIndices = getActivePlaybackIndices();
  const posInList = activeIndices.indexOf(currentIndex);

  let nextIndex;
  if (isShuffle) {
    do {
      nextIndex = activeIndices[Math.floor(Math.random() * activeIndices.length)];
    } while (nextIndex === currentIndex && activeIndices.length > 1);
  } else {
    const nextPos = (posInList + 1) % activeIndices.length;
    nextIndex = activeIndices[nextPos];
  }
  loadTrack(nextIndex);
  playTrack();
}

function prevTrack() {
  const activeIndices = getActivePlaybackIndices();
  const posInList = activeIndices.indexOf(currentIndex);

  const prevPos = (posInList - 1 + activeIndices.length) % activeIndices.length;
  const prevIndex = activeIndices[prevPos];
  loadTrack(prevIndex);
  playTrack();
}

/* ===================================================================
   EVENTS
   =================================================================== */
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

repeatBtn.addEventListener("click", () => {
  if (repeatMode === "off") repeatMode = "all";
  else if (repeatMode === "all") repeatMode = "one";
  else repeatMode = "off";
  repeatBtn.classList.toggle("active", repeatMode !== "off");
  repeatBtn.title = repeatMode === "one" ? "Repeat: one track" : repeatMode === "all" ? "Repeat: all" : "Repeat: off";
});

audio.addEventListener("ended", () => {
  if (repeatMode === "one") {
    audio.currentTime = 0;
    playTrack();
  } else if (repeatMode === "off" && !isShuffle && isLastInCategory(currentIndex)) {
    pauseTrack();
  } else {
    nextTrack();
  }
});

audio.addEventListener("timeupdate", () => {
  const pct = (audio.currentTime / audio.duration) * 100 || 0;
  progressMask.style.width = `${pct}%`;
  playhead.style.left = `${pct}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

scrubber.addEventListener("click", (e) => {
  if (!audio.duration) return;
  const rect = scrubber.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
});

volumeSlider.addEventListener("input", (e) => {
  audio.volume = parseFloat(e.target.value);
});

searchInput.addEventListener("input", (e) => {
  activeSearchQuery = e.target.value.trim();
  renderCategorySections();
});

/* ===================================================================
   INIT
   =================================================================== */
audio.volume = parseFloat(volumeSlider.value);
renderMoodPills();
renderCategorySections();
showEmptyNowPlaying();
