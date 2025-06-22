document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const themeToggle = document.getElementById('themeToggle');
  const moodCards = document.querySelectorAll('.mood-card');
  const audioPlayer = document.getElementById('audioPlayer');
  const stopBtn = document.getElementById('stopBtn');
  const playBtn = document.getElementById('playBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
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

  // App State
  let currentSongIndex = 0;
  let isPlaying = false;
  let isShuffled = false;
  let isRepeated = false;
  let queue = [];
  
  // Sample Data
  const songs = [
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
      cover: "blinding light.jpeg",
      audio: "https://youtu.be/34Na4j8AVgA?si=FvfXjDQjFoX445IJ",
      duration: "3:20",
      mood: "happy"
    },
    {
      title: "Save Your Tears",
      artist: "The Weeknd",
      cover: "save your tears.jpeg",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      duration: "3:35",
      mood: "happy"
    },
    {
      title: "Someone Like You",
      artist: "Adele",
      cover: "someone like you.jpeg",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      duration: "4:45",
      mood: "sad"
    },
    {
      title: "All of Me",
      artist: "John Legend",
      cover: "all of me.jpeg",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      duration: "4:29",
      mood: "romantic"
    },
    {
      title: "Shape of You",
      artist: "Ed Sheeran",
      cover: "shape of you.jpeg",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      duration: "3:53",
      mood: "happy"
    },
    {
      title: "Believer",
      artist: "Imagine Dragons",
      cover: "believer.jpeg",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      duration: "3:24",
      mood: "energetic"
    },
    {
      title: "Starboy",
      artist: "The Weeknd, Daft Punk",
      cover: "starboy.jpg",
      audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      duration: "3:50",
      mood: "energetic"
    },
    {
      title: "Perfect",
      artist: "Ed Sheeran",
      cover: "perfect.jpeg",
      audio: "songs/perfect.mp3",
      duration: "4:23",
      mood: "romantic"
    }
  ];

  const playlists = [
    {
      title: "Happy Hits",
      description: "Boost your mood with these tracks",
      cover: "happy hits.png",
      songs: [0, 1, 4] // Indexes from songs array
    },
    {
      title: "Chill Vibes",
      description: "Relax and unwind",
      cover: "chill vibes.jpeg",
      songs: [2, 3, 7]
    },
    {
      title: "Workout Mix",
      description: "Pump up your energy",
      cover: "workout mix.jpeg",
      songs: [5, 6]
    },
    {
      title: "Romantic Evenings",
      description: "Perfect for date night",
      cover: "romantic evenings.png",
      songs: [3, 7]
    }
  ];

  // Initialize App
  function init() {
    renderSongs();
    renderPlaylists();
    updatePlayerUI();
    setVolume();
    
    // Set first song as default
    if (songs.length > 0) {
      queue = [...songs];
      loadSong(queue[currentSongIndex]);
    }
  }

  // Render Songs
  function renderSongs() {
    songGrid.innerHTML = '';
    
    // Get 6 random songs for recommended section
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

  // Render Playlists
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
        // Add all playlist songs to queue
        queue = playlist.songs.map(index => songs[index]);
        currentSongIndex = 0;
        loadSong(queue[currentSongIndex]);
        playSong();
        updateQueueUI();
      });
      
      playlistGrid.appendChild(playlistEl);
    });
  }

  // Update Player UI
  function updatePlayerUI() {
    const song = queue[currentSongIndex] || {};
    currentSongTitle.textContent = song.title || 'Not Playing';
    currentSongArtist.textContent = song.artist || 'Select a song';
    currentAlbumCover.src = song.cover || '';
    currentAlbumCover.alt = song.title || '';
    
    // Update progress bar max time
    if (audioPlayer.duration) {
      totalTimeEl.textContent = formatTime(audioPlayer.duration);
    }
  }

  // Load Song
  function loadSong(song) {
    if (!song) return;
    
    audioPlayer.src = song.audio;
    audioPlayer.load();
    updatePlayerUI();
    
    // If was playing, continue playing
    if (isPlaying) {
      audioPlayer.play().catch(e => console.log('Playback error:', e));
    }
  }

  // Play Song
  function playSong() {
    isPlaying = true;
    audioPlayer.play().catch(e => console.log('Playback error:', e));
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
    document.title = '▶ ${queue[currentSongIndex].title} - Vibify';
  }

  // Pause Song
  function pauseSong() {
    isPlaying = false;
    audioPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
    document.title = 'Vibify - Mood Music Player';
  }

  // Previous Song
  function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
      currentSongIndex = queue.length - 1;
    }
    loadSong(queue[currentSongIndex]);
    if (isPlaying) playSong();
  }

  // Next Song
  function nextSong() {
    if (isRepeated) {
      audioPlayer.currentTime = 0;
      audioPlayer.play();
      return;
    }
    
    currentSongIndex++;
    if (currentSongIndex > queue.length - 1) {
      currentSongIndex = 0;
    }
    loadSong(queue[currentSongIndex]);
    if (isPlaying) playSong();
  }

  // Update Progress Bar
  function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = '${progressPercent}%';
    currentTimeEl.textContent = formatTime(currentTime);
  }

  // Set Progress
  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioPlayer.duration;
    audioPlayer.currentTime = (clickX / width) * duration;
  }

  // Set Volume
  function setVolume() {
    audioPlayer.volume = volumeControl.value / 100;
  }

  // Format Time
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Update Queue UI
  function updateQueueUI() {
    queueList.innerHTML = '';
    
    queue.forEach((song, index) => {
      const queueItem = document.createElement('div');
      queueItem.className = "queue-item ${index === currentSongIndex ? 'active' : ''}";
      
      queueItem.innerHTML = `
        <img src="${song.cover}" alt="${song.title}">
        <div class="queue-item-info">
          <h4>${song.title}</h4>
          <p>${song.artist}</p>
        </div>
        <div class="queue-item-duration">${song.duration}</div>
      `;
      
      queueItem.addEventListener('click', () => {
        currentSongIndex = index;
        loadSong(queue[currentSongIndex]);
        playSong();
        updateQueueUI();
      });
      
      queueList.appendChild(queueItem);
    });
  }

  // Toggle Theme
  function toggleTheme() {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeToggle.innerHTML = isLight 
      ? '<i class="fas fa-moon"></i> Dark Mode' 
      : '<i class="fas fa-sun"></i> Light Mode';
    
    // Save preference to localStorage
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  }

  // Set Mood
  function setMood(mood) {
    // Remove all mood classes
    document.body.className = '';
    
    // Add selected mood class
    document.body.classList.add(mood);
    
    // Filter songs by mood
    queue = songs.filter(song => song.mood === mood);
    currentSongIndex = 0;
    
    if (queue.length > 0) {
      loadSong(queue[currentSongIndex]);
      playSong();
    }
    
    // Save mood to localStorage
    localStorage.setItem('mood', mood);
  }

  // Event Listeners
  themeToggle.addEventListener('click', toggleTheme);

  moodCards.forEach(card => {
    card.addEventListener('click', () => {
      setMood(card.dataset.mood);
      
      // Update active card
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

  likeBtn.addEventListener('click', () => {
    likeBtn.classList.toggle('active');
    likeBtn.innerHTML = likeBtn.classList.contains('active') 
      ? '<i class="fas fa-heart"></i>' 
      : '<i class="far fa-heart"></i>';
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === queueModal) {
      queueModal.classList.remove('active');
    }
  });

  stopBtn.addEventListener('click', function () {
    audioPlayer.pause();                // Pause the audio
    audioPlayer.currentTime = 0;        // Reset to start
    progress.style.width = '0%';        // Reset progress bar
    currentTime.textContent = '0:00';   // Reset time
    playBtn.innerHTML = '<i class="fas fa-play"></i>'; // Update play button
  });

  // Load saved preferences
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
  }

  if (localStorage.getItem('mood')) {
    const savedMood = localStorage.getItem('mood');
    document.body.classList.add(savedMood);
    
    // Highlight the active mood card
    moodCards.forEach(card => {
      if (card.dataset.mood === savedMood) {
        card.classList.add('active');
      }
    });
  }

  // Initialize the app
  init();
});
