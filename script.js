const moodMusic = {
  happy: "https://www.bensound.com/bensound-music/bensound-happyrock.mp3",
  sad: "https://www.bensound.com/bensound-music/bensound-slowmotion.mp3",
  angry: "https://www.bensound.com/bensound-music/bensound-actionable.mp3",
  relaxed: "https://www.bensound.com/bensound-music/bensound-sunny.mp3",
  romantic: "https://www.bensound.com/bensound-music/bensound-love.mp3"
};

const player = document.getElementById("player");
const cards = document.querySelectorAll(".mood-card");
const visualizer = document.querySelector(".visualizer");

cards.forEach(card => {
  card.addEventListener("click", () => {
    const mood = card.dataset.mood;
    document.body.className = mood;
    player.src = moodMusic[mood];
    player.play();
    setupVisualizer();
  });
});

function setupVisualizer() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();

  const src = audioContext.createMediaElementSource(player);
  const analyser = audioContext.createAnalyser();

  src.connect(analyser);
  analyser.connect(audioContext.destination);

  analyser.fftSize = 64;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  function animate() {
    analyser.getByteFrequencyData(dataArray);
    const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const scale = 1 + avg / 100;
    visualizer.style.transform = `scale(${scale})`;
    requestAnimationFrame(animate);
  }

  audioContext.resume().then(animate);
}
