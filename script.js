
const audio = document.getElementById("audio");

const playBtn = document.getElementById("play");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");

const progress = document.getElementById("progress");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");
const volumeValue = document.getElementById("volume-value");

const playlist = document.getElementById("playlist");
const search = document.getElementById("search");

// Music collection
const songs = [
    {
        title: "Midnight Dreams",
        artist: "LoFi Beats",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600"
    },
    {
        title: "Rainy Nights",
        artist: "Chill Vibes",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        cover: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600"
    },
    {
        title: "Lost In Thoughts",
        artist: "Dream Music",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        cover: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=600"
    },
    {
        title: "Coffee And Chill",
        artist: "LoFi Station",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        cover: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600"
    },
    {
        title: "Night Drive",
        artist: "Chill Beats",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        cover: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=600"
    },
    {
        title: "Peaceful Mind",
        artist: "Relax Music",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        cover: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600"
    },
    {
        title: "Late Night Study",
        artist: "Study Beats",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        cover: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600"
    },
    {
        title: "Ocean Breeze",
        artist: "Calm Sounds",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600"
    },
    {
        title: "Dreamy Evening",
        artist: "Soft Vibes",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        cover: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=600"
    },
    {
        title: "Good Night",
        artist: "Sleepy Beats",
        src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600"
    }
];

let songIndex = 0;
let isPlaying = false;

// Load song
function loadSong(index) {

    const song = songs[index];

    title.textContent = song.title;
    artist.textContent = song.artist;
    cover.src = song.cover;

    audio.src = song.src;

    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    renderPlaylist(search.value);
}

// Play music
function playSong() {

    audio.play()
        .then(() => {
            isPlaying = true;
            playBtn.textContent = "⏸";
        })
        .catch(error => {
            console.log("Audio could not play:", error);
            isPlaying = false;
            playBtn.textContent = "▶";
        });
}

// Pause music
function pauseSong() {

    audio.pause();
    isPlaying = false;
    playBtn.textContent = "▶";
}

// Play and Pause
playBtn.addEventListener("click", () => {

    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }

});

// Next song
function nextSong() {

    songIndex = (songIndex + 1) % songs.length;

    loadSong(songIndex);
    playSong();

}

// Previous song
function prevSong() {

    songIndex = (songIndex - 1 + songs.length) % songs.length;

    loadSong(songIndex);
    playSong();

}

nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

// Update progress
audio.addEventListener("timeupdate", () => {

    if (audio.duration && Number.isFinite(audio.duration)) {

        progress.value =
            (audio.currentTime / audio.duration) * 100;

        currentTime.textContent =
            formatTime(audio.currentTime);

        duration.textContent =
            formatTime(audio.duration);

    }

});

// Get song duration
audio.addEventListener("loadedmetadata", () => {

    duration.textContent = formatTime(audio.duration);

});

// Time format
function formatTime(time) {

    if (!Number.isFinite(time)) return "0:00";

    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);

    return `${min}:${sec.toString().padStart(2, "0")}`;

}

// Seek music
progress.addEventListener("input", () => {

    if (audio.duration) {

        audio.currentTime =
            (progress.value / 100) * audio.duration;

    }

});

// Volume control
volume.addEventListener("input", () => {

    audio.volume = Number(volume.value);

    volumeValue.textContent =
        Math.round(volume.value * 100) + "%";

});

// Automatically play next song
audio.addEventListener("ended", nextSong);

// Render playlist
function renderPlaylist(filter = "") {

    playlist.innerHTML = "";

    const filteredSongs = songs
        .map((song, index) => ({ ...song, index }))
        .filter(song =>
            song.title.toLowerCase().includes(filter.toLowerCase()) ||
            song.artist.toLowerCase().includes(filter.toLowerCase())
        );

    if (filteredSongs.length === 0) {

        playlist.innerHTML =
            '<div class="empty">No songs found 🎵</div>';

        return;

    }

    filteredSongs.forEach(song => {

        const item = document.createElement("div");

        item.className =
            "song" +
            (song.index === songIndex ? " active" : "");

        item.innerHTML = `
            <span class="song-number">
                ${String(song.index + 1).padStart(2, "0")}
            </span>

            <div class="song-info">
                <strong>${song.title}</strong>
                <small>${song.artist}</small>
            </div>

            <span class="song-status">
                ${song.index === songIndex && isPlaying ? "♫" : "♪"}
            </span>
        `;

        item.addEventListener("click", () => {

            songIndex = song.index;

            loadSong(songIndex);
            playSong();

        });

        playlist.appendChild(item);

    });

}

// Search songs
search.addEventListener("input", () => {

    renderPlaylist(search.value);

});

// Update playlist when playback changes
audio.addEventListener("play", () => {
    isPlaying = true;
    playBtn.textContent = "⏸";
    renderPlaylist(search.value);
});

audio.addEventListener("pause", () => {
    isPlaying = false;
    playBtn.textContent = "▶";
    renderPlaylist(search.value);
});

// Initial setup
audio.volume = 0.7;
loadSong(songIndex);
renderPlaylist();

