// Mood Music Player
document.addEventListener('DOMContentLoaded', function() {
  // Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', toggleTheme);

  // Mood Selection
  const moodCards = document.querySelectorAll('.mood-card');
  moodCards.forEach(card => {
    card.addEventListener('click', function() {
      selectMood(this.dataset.mood);
    });
  });

  // Playlist Cards
  const playlistCards = document.querySelectorAll('.card');
  playlistCards.forEach(card => {
    card.addEventListener('click', function() {
      playPlaylist(this);
    });
  });

  // Audio Player
  const player = document.getElementById('player');
  
  // Mood Music Data
  const moodPlaylists = {
    happy: [
      { title: "Happy Hits", artist: "Various Artists", cover: "https://cdn-images.dzcdn.net/images/cover/49d2bb63aabe4ab8ae358896c14e302a/0x1900-000000-80-0-0.jpg", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
      { title: "Feel Good", artist: "Positive Vibes", cover: "https://i.scdn.co/image/ab67706f00000002d72ef75e14ca6f60ea2364c2", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" }
    ],
    sad: [
      { title: "Sad Songs", artist: "Heartbreak", cover: "https://i.scdn.co/image/ab67706f00000002a980b152e708b33a1123f4b1", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
      { title: "Melancholy", artist: "Deep Thoughts", cover: "https://i.scdn.co/image/ab67706f00000002d1b5e5d5c7e3e3a5e3d3e3d3", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
    ],
    angry: [
      { title: "Angry Metal", artist: "Heavy Beats", cover: "https://i.scdn.co/image/ab67706f00000002d1b5e5d5c7e3e3a5e3d3e3d3", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
      { title: "Punk Rock", artist: "Rebel Sounds", cover: "https://i.scdn.co/image/ab67706f00000002d1b5e5d5c7e3e3a5e3d3e3d3", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" }
    ],
    relaxed: [
      { title: "Lofi Chill", artist: "Chill Beats", cover: "https://cms-assets.tutsplus.com/uploads/users/30/posts/35608/preview_image/chill-lofi.jpg", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
      { title: "Calming Acoustic", artist: "Instrumental", cover: "https://i.scdn.co/image/ab67706f00000002d1b5e5d5c7e3e3a5e3d3e3d3", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" }
    ],
    romantic: [
      { title: "Love Songs", artist: "Romantic", cover: "https://i.scdn.co/image/ab67706f00000002d1b5e5d5c7e3e3a5e3d3e3d3", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
      { title: "Slow Jams", artist: "Intimate", cover: "https://i.scdn.co/image/ab67706f00000002d1b5e5d5c7e3e3a5e3d3e3d3", audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" }
    ]
  };

  // Functions
  function toggleTheme() {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    themeToggle.textContent = isLight ? '🌙 Dark Mode' : '☀️ Light Mode';
  }

  function selectMood(mood) {
    // Remove active class from all mood cards
    moodCards.forEach(card => card.classList.remove('active'));
    
    // Add active class to selected mood
    const selectedCard = document.querySelector(`.mood-card[data-mood="${mood}"]`);
    selectedCard.classList.add('active');
    
    // Change body class to reflect mood
    document.body.className = ''; // Reset all classes
    document.body.classList.add(mood);
    
    // Visual feedback
    animateVisualizer();
  }

  function playPlaylist(card) {
    const title = card.querySelector('h2').textContent;
    const imgSrc = card.querySelector('img').src;
    
    // Find the song in our moodPlaylists
    let song = null;
    for (const mood in moodPlaylists) {
      song = moodPlaylists[mood].find(track => track.title === title);
      if (song) break;
    }
    
    if (song) {
      player.src = song.audio;
      player.play();
      
      // Update visualizer
      animateVisualizer();
      
      // Show notification
      showNowPlaying(song.title, song.artist, imgSrc);
    }
  }

  function animateVisualizer() {
    const visualizer = document.querySelector('.visualizer');
    visualizer.style.transform = 'scale(1.2)';
    setTimeout(() => {
      visualizer.style.transform = 'scale(1)';
    }, 200);
  }

  function showNowPlaying(title, artist, cover) {
    // This could be enhanced with a proper notification system
    console.log(`Now Playing: ${title} by ${artist}`);
    
    // In a real app, you would update the player UI with this info
    // For now, we'll just log it to the console
  }

  // Audio player visualizer effect
  player.addEventListener('play', function() {
    const visualizer = document.querySelector('.visualizer');
    visualizer.style.animation = 'pulse 0.5s infinite alternate';
  });

  player.addEventListener('pause', function() {
    const visualizer = document.querySelector('.visualizer');
    visualizer.style.animation = 'none';
  });

  // Add pulse animation dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes pulse {
      from { transform: scale(1); opacity: 0.8; }
      to { transform: scale(1.2); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
});