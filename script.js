document.addEventListener('DOMContentLoaded', function () {
  const themeToggle = document.getElementById('themeToggle');
  const icon = themeToggle.querySelector('i');
  const moodCards = document.querySelectorAll('.mood-card');
  const audioPlayer = document.getElementById('audioPlayer');
  const stopBtn = document.getElementById('stopBtn');
  const playBtn = document.getElementById('playBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const repeatBtn = document.getElementById('repeatBtn');
  const progress = document.getElementById('progress');
  const progressContainer = document.querySelector('.progress-container');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.getElementById('totalTime');
  const volumeControl = document.getElementById('volumeControl');
  const queueBtn = document.querySelector('.btn-queue');
  const queueModal = document.getElementById('queueModal');
  const closeModal = document.querySelector('.close-modal');
  const queueList = document.getElementById('queueList');
  const likeBtn = document.querySelector('.btn-like');
  const currentSongTitle = document.getElementById('currentSongTitle');
  const currentSongArtist = document.getElementById('currentSongArtist');
  const currentAlbumCover = document.getElementById('currentAlbumCover');
  const songGrid = document.querySelector('.song-grid');
  const playlistGrid = document.querySelector('.playlist-grid');
  const back10Btn = document.getElementById('back10Btn');
  const forward10Btn = document.getElementById('forward10Btn');

  let currentSongIndex = 0;
  let isPlaying = false;
  let isShuffled = false;
  let stopToggled = false;
  let queue = [];

  const songs = [
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
      cover: "img/blinding light.jpeg",
      audio: "songs/blinding lights.mp3",
      duration: "3:20",
      mood: "happy",
      liked: false
    },
    {
      title: "Save Your Tears",
      artist: "The Weeknd",
      cover: "img/save your tears.jpeg",
      audio: "songs/save your tears.mp3",
      duration: "3:35",
      mood: "happy",
      liked: false
    },
    {
      title: "Soulmate",
      artist: "badshah, arijit singh",
      cover: "img/soulmate.png",
      audio: "songs/soulmate.mp3",
      duration: "3:34",
      mood: "energetic",
      liked: false
    },
    {
      title: "All of Me",
      artist: "John Legend",
      cover: "img/all of me.jpeg",
      audio: "songs/all of me.mp3",
      duration: "4:29",
      mood: "romantic",
      liked: false
    },
    {
      title: "Shape of You",
      artist: "Ed Sheeran",
      cover: "img/shape of you.jpeg",
      audio: "songs/shape of you.mp3",
      duration: "3:53",
      mood: "happy",
      liked: false
    },
    {
      title: "Believer",
      artist: "Imagine Dragons",
      cover: "img/believer.jpeg",
      audio: "songs/believer.mp3",
      duration: "3:24",
      mood: "energetic",
      liked: false
    },
    {
      title: "Starboy",
      artist: "The Weeknd, Daft Punk",
      cover: "img/starboy.jpg",
      audio: "songs/starboy.mp3",
      duration: "3:50",
      mood: "energetic",
      liked: false
    },
    {
      title: "Perfect",
      artist: "Ed Sheeran",
      cover: "img/perfect.jpeg",
      audio: "songs/perfect.mp3",
      duration: "4:23",
      mood: "romantic",
      liked: false
    }
  ];

  const playlists = [
    {
      title: "Happy Hits",
      description: "Boost your mood with these tracks",
      cover: "img/happy hits.png",
      songs: [0, 1, 4]
    },
    {
      title: "Chill Vibes",
      description: "Relax and unwind",
      cover: "img/chill vibes.jpeg",
      songs: [2, 3, 7]
    },
    {
      title: "Workout Mix",
      description: "Pump up your energy",
      cover: "img/workout mix.jpeg",
      songs: [5, 6]
    },
    {
      title: "Romantic Evenings",
      description: "Perfect for date night",
      cover: "img/romantic evenings.png",
      songs: [3, 7]
    }
  ];

  function init() {
    loadLikedSongs();
    renderSongs();
    renderPlaylists();
    updatePlayerUI();
    setVolume();
    updateLikedSongs();

    if (songs.length > 0) {
      queue = [...songs];
      loadSong(queue[currentSongIndex]);
    }
  }

  function renderSongs() {
    songGrid.innerHTML = '';
    const shuffled = [...songs].sort(() => 0.5 - Math.random());
    const recommended = shuffled.slice(0, 6);

    recommended.forEach((song, index) => {
      const songEl = document.createElement('div');
      songEl.className = 'song-card';
      songEl.dataset.index = index;

      songEl.innerHTML = `
        <div class="card-image">
          <img src="${song.cover}" alt="${song.title}">
          <div class="play-btn"><i class="fas fa-play"></i></div>
        </div>
        <div class="card-info">
          <h3>${song.title}</h3>
          <p>${song.artist}</p>
        </div>
      `;

      songEl.addEventListener('click', () => {
        const songIndex = songs.findIndex(s => s.title === song.title);
        if (songIndex !== -1) {
          currentSongIndex = songIndex;
          loadSong(songs[songIndex]);
          playSong();
        }
      });

      songGrid.appendChild(songEl);
    });
  }

  function renderPlaylists() {
    playlistGrid.innerHTML = '';

    playlists.forEach(playlist => {
      const playlistEl = document.createElement('div');
      playlistEl.className = 'playlist-card';

      playlistEl.innerHTML = `
        <div class="card-image">
          <img src="${playlist.cover}" alt="${playlist.title}">
          <div class="play-btn"><i class="fas fa-play"></i></div>
        </div>
        <div class="card-info">
          <h3>${playlist.title}</h3>
          <p>${playlist.description}</p>
        </div>
      `;

      playlistEl.addEventListener('click', () => {
        queue = playlist.songs.map(index => songs[index]);
        currentSongIndex = 0;
        loadSong(queue[currentSongIndex]);
        playSong();
        updateQueueUI();
      });

      playlistGrid.appendChild(playlistEl);
    });
  }

  function updatePlayerUI() {
    const song = queue[currentSongIndex] || {};
    currentSongTitle.textContent = song.title || 'Not Playing';
    currentSongArtist.textContent = song.artist || 'Select a song';
    currentAlbumCover.src = song.cover || '';
    currentAlbumCover.alt = song.title || '';

    if (audioPlayer.duration) {
      totalTimeEl.textContent = formatTime(audioPlayer.duration);
    }
  }

  function loadSong(song) {
    if (!song) return;
    audioPlayer.src = song.audio;
    audioPlayer.load();
    updatePlayerUI();
    if (isPlaying) {
      playSong();
    }
    updateLikeButtonUI(song);
  }

  function playSong() {
    audioPlayer.play().then(() => {
      isPlaying = true;
      stopToggled = false;
      playBtn.innerHTML = '<i class="fas fa-pause"></i>';
      document.title = `▶ ${queue[currentSongIndex].title} - Vibify`;
    }).catch(e => console.log('Playback error:', e));
  }

  function pauseSong() {
    isPlaying = false;
    stopToggled = false;
    audioPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    document.title = 'Vibify - Mood Music Player';
  }

  function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) currentSongIndex = queue.length - 1;
    loadSong(queue[currentSongIndex]);
    if (isPlaying) playSong();
  }

  function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= queue.length) currentSongIndex = 0;
    loadSong(queue[currentSongIndex]);
    if (isPlaying) playSong();
  }

  function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const percent = (currentTime / duration) * 100;
    progress.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
  }

  function updateProgressManually() {
    const { duration, currentTime } = audioPlayer;
    if (!duration) return;
    const percent = (currentTime / duration) * 100;
    progress.style.width = `${percent}%`;
    currentTimeEl.textContent = formatTime(currentTime);
  }

  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
  }

  function setVolume() {
    audioPlayer.volume = volumeControl.value / 100;
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function updateQueueUI() {
    queueList.innerHTML = '';
    queue.forEach((song, index) => {
      const item = document.createElement('div');
      item.className = `queue-item ${index === currentSongIndex ? 'active' : ''}`;
      item.innerHTML = `
        <img src="${song.cover}" alt="${song.title}">
        <div class="queue-item-info">
          <h4>${song.title}</h4>
          <p>${song.artist}</p>
        </div>
        <div class="queue-item-duration">${song.duration}</div>
      `;
      item.addEventListener('click', () => {
        currentSongIndex = index;
        loadSong(queue[currentSongIndex]);
        playSong();
        updateQueueUI();
      });
      queueList.appendChild(item);
    });
  }

  function toggleLikeCurrent() {
    const song = queue[currentSongIndex];
    song.liked = !song.liked;
    updateLikeButtonUI(song);
    updateLikedSongs();
    saveLikedSongs();
  }

  function updateLikeButtonUI(song) {
    likeBtn.classList.toggle('active', song.liked);
    likeBtn.innerHTML = song.liked ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
  }

  function updateLikedSongs() {
    const grid = document.getElementById('likedSongsGrid');
    grid.innerHTML = '';
    songs.filter(s => s.liked).forEach(song => {
      const div = document.createElement('div');
      div.className = 'song-card';
      div.innerHTML = `
        <div class="card-image">
          <img src="${song.cover}" alt="${song.title}">
          <div class="play-btn"><i class="fas fa-play"></i></div>
        </div>
        <div class="card-info">
          <h3>${song.title}</h3>
          <p>${song.artist}</p>
        </div>
      `;
      div.addEventListener('click', () => {
        currentSongIndex = queue.findIndex(s => s.title === song.title);
        if (currentSongIndex === -1) {
          queue.push(song);
          currentSongIndex = queue.length - 1;
        }
        loadSong(queue[currentSongIndex]);
        playSong();
      });
      grid.appendChild(div);
    });
  }
  
  



  function saveLikedSongs() {
    const likedTitles = songs.filter(s => s.liked).map(s => s.title);
    localStorage.setItem('likedSongs', JSON.stringify(likedTitles));
  }

  function loadLikedSongs() {
    const likedTitles = JSON.parse(localStorage.getItem('likedSongs')) || [];
    songs.forEach(song => {
      song.liked = likedTitles.includes(song.title);
    });
  }

  function toggleTheme() {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeToggle.innerHTML = isLight
      ? '<i class="fas fa-moon"></i> Dark Mode'
      : '<i class="fas fa-sun"></i> Light Mode';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }

  function setMood(mood) {
    document.body.className = '';
    document.body.classList.add(mood);
    queue = songs.filter(song => song.mood === mood);
    currentSongIndex = 0;
    if (queue.length > 0) {
      loadSong(queue[currentSongIndex]);
      playSong();
    }
    localStorage.setItem('mood', mood);
  }

  themeToggle.addEventListener('click', toggleTheme);
  moodCards.forEach(card => {
    card.addEventListener('click', () => {
      setMood(card.dataset.mood);
      moodCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  playBtn.addEventListener('click', () => {
    isPlaying ? pauseSong() : playSong();
  });

  prevBtn.addEventListener('click', prevSong);
  nextBtn.addEventListener('click', nextSong);

  audioPlayer.addEventListener('timeupdate', updateProgress);
  audioPlayer.addEventListener('ended', nextSong);
  audioPlayer.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audioPlayer.duration);
  });

  progressContainer.addEventListener('click', setProgress);
  volumeControl.addEventListener('input', setVolume);

  queueBtn.addEventListener('click', () => {
    queueModal.classList.add('active');
    updateQueueUI();
  });

  closeModal.addEventListener('click', () => {
    queueModal.classList.remove('active');
  });

  window.addEventListener('click', e => {
    if (e.target === queueModal) {
      queueModal.classList.remove('active');
    }
  });

  stopBtn.addEventListener('click', () => {
    if (!stopToggled) {
      audioPlayer.pause();
      isPlaying = false;
      stopToggled = true;
      playBtn.innerHTML = '<i class="fas fa-play"></i>';
      document.title = 'Vibify - Mood Music Player';
    } else {
      audioPlayer.play().then(() => {
        isPlaying = true;
        stopToggled = false;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        document.title = `▶ ${queue[currentSongIndex].title} - Vibify`;
      }).catch(e => console.log('Playback error:', e));
    }
  });

  repeatBtn.addEventListener('click', () => {
    audioPlayer.currentTime = 0;
    if (!isPlaying) {
      playSong();
    }
  });

  back10Btn.addEventListener('click', () => {
    audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
    updateProgressManually();
  });

  forward10Btn.addEventListener('click', () => {
    audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 10);
    updateProgressManually();
  });

  likeBtn.addEventListener('click', toggleLikeCurrent);

  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
  }

  if (localStorage.getItem('mood')) {
    const savedMood = localStorage.getItem('mood');
    document.body.classList.add(savedMood);
    moodCards.forEach(card => {
      if (card.dataset.mood === savedMood) {
        card.classList.add('active');
      }
    });
  }

  function toggleTheme() {
  document.body.classList.toggle('light');
  const isLight = document.body.classList.contains('light');
  themeToggle.innerHTML = isLight
    ? '<i class="fas fa-moon"></i> Dark Mode'
    : '<i class="fas fa-sun"></i> Light Mode';
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// On Load
if (localStorage.getItem('theme') === 'light') {
  document.body.classList.add('light');
  themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
}

  init();
    init();

  // Scroll to Liked Songs section when clicked
  const likedSongsLink = document.getElementById('likedSongsLink');
  if (likedSongsLink) {
    likedSongsLink.addEventListener('click', () => {
      const likedSection = document.querySelector('.liked-section');
      if (likedSection) {
        likedSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

