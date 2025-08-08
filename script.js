// Radio stations are now loaded from stations.js
// STATIONS array is defined in stations.js file

let currentStationIndex = 0;
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volBtn = document.getElementById('volBtn');
const volSlider = document.getElementById('vol');
const titleElement = document.querySelector('.title');
const menuToggle = document.getElementById('menuToggle');
const stationMenu = document.getElementById('stationMenu');
const canvas = document.getElementById('waveform');
const ctx = canvas.getContext('2d');
let analyser, audioCtx, dataArray, bufferLength;
let isAudioInitialized = false;

function renderPlayIcon(isPlaying){
  playBtn.innerHTML = isPlaying
    ? '<svg viewBox="0 0 24 24" width="30" height="30"><rect x="6.75" y="5.25" width="2.6" height="13.5" rx="0.6" fill="#111"></rect><rect x="14.75" y="5.25" width="2.6" height="13.5" rx="0.6" fill="#111"></rect></svg>'
    : '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M5.25 5.25l13.5 6.75-13.5 6.75V5.25z" fill="#111"></path></svg>';
}
renderPlayIcon(false);

let player;
let isPlayerReady = false;
let shouldAutoPlay = false;
function loadYT(){
  if (window.YT && window.YT.Player) return onYouTubeAPIReady();
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.body.appendChild(tag);
  window.onYouTubeIframeAPIReady = onYouTubeAPIReady;
}

function initAudioAnalysis() {
  if (isAudioInitialized) return;
  
  try {
    // Create audio context
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Get the iframe element
    const iframe = document.querySelector('#player iframe');
    if (!iframe) {
      console.log('No iframe found, using fallback waveform');
      return;
    }

    // Try to connect to audio - this may not work due to CORS restrictions
    // So we'll use a hybrid approach with beat detection simulation
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    isAudioInitialized = true;
    
    // Since we can't directly access YouTube's audio due to CORS,
    // we'll simulate beat-reactive behavior based on the music's typical patterns
    
  } catch (error) {
    console.log('Audio context initialization failed, using simulated beats');
  }
}

function createPlayer() {
  const currentStation = STATIONS[currentStationIndex];
  titleElement.textContent = `Playing: ${currentStation.name}`;
  isPlayerReady = false;
  
  player = new YT.Player('player', {
    height: '1', width: '1',
    videoId: currentStation.id,
    playerVars: { autoplay: 1, controls: 0, modestbranding: 1, playsinline: 1 },
    events: {
      onReady: (e) => {
        isPlayerReady = true;
        e.target.setVolume(parseFloat(volSlider.value) * 100);
        initAudioAnalysis();
        
        // Auto-play when ready
        setTimeout(() => {
          e.target.playVideo();
        }, 500);
      },
      onStateChange: (e) => {
        if (e.data === 1) { // YT.PlayerState.PLAYING
          renderPlayIcon(true);
          initAudioAnalysis();
        }
        if (e.data === 2 || e.data === 0) { // YT.PlayerState.PAUSED || YT.PlayerState.ENDED
          renderPlayIcon(false);
        }
      }
    }
  });
}

function onYouTubeAPIReady(){
  populateStationMenu();
  createPlayer();
}

// Initialize menu immediately when script loads
populateStationMenu();

function populateStationMenu() {
  console.log('Populating station menu with', STATIONS.length, 'stations');
  console.log('STATIONS:', STATIONS);
  
  stationMenu.innerHTML = STATIONS.map((station, index) => `
    <button class="station-item ${index === currentStationIndex ? 'active' : ''}" data-index="${index}">
      <div class="station-dot"></div>
      <span>${station.name}</span>
    </button>
  `).join('') + `
    <div class="station-credit">
      <p>Made with ♡ by <a href="https://beamingmedia.netlify.app/" target="_blank">Beaming Media</a></p>
      <p>© Mehboob</p>
      <p><a href="https://github.com/beamingnebula/Minimal-Lofi" target="_blank" class="github-link">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        GitHub
      </a></p>
    </div>
  `;
  
  console.log('Menu HTML generated, items count:', stationMenu.children.length);
  
  // Add click listeners to station items
  stationMenu.querySelectorAll('.station-item').forEach(item => {
    item.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.dataset.index);
      selectStation(index);
      toggleMenu(false);
    });
  });
}

function selectStation(index) {
  if (index === currentStationIndex) return;
  
  currentStationIndex = index;
  
  if (player && player.destroy) {
    player.destroy();
  }
  
  setTimeout(() => {
    createPlayer();
    updateActiveStation();
  }, 100);
}

function updateActiveStation() {
  stationMenu.querySelectorAll('.station-item').forEach((item, index) => {
    item.classList.toggle('active', index === currentStationIndex);
  });
}

function changeStation(direction) {
  if (!window.YT || !window.YT.Player) {
    loadYT();
    return;
  }
  
  let newIndex;
  if (direction === 'next') {
    newIndex = (currentStationIndex + 1) % STATIONS.length;
  } else {
    newIndex = (currentStationIndex - 1 + STATIONS.length) % STATIONS.length;
  }
  
  selectStation(newIndex);
}

function toggleMenu(force) {
  const isOpen = force !== undefined ? force : !stationMenu.classList.contains('open');
  stationMenu.classList.toggle('open', isOpen);
  
  // Debug: Log menu state and visibility
  console.log('Menu toggled:', isOpen, 'Items count:', stationMenu.children.length);
  
  // Rotate chevron icon with smooth animation
  const chevron = menuToggle.querySelector('svg');
  chevron.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  chevron.style.transform = isOpen ? 'rotate(90deg)' : 'rotate(0deg)';
  
  // Handle menu visibility
  if (isOpen) {
    stationMenu.style.display = 'block';
    stationMenu.style.pointerEvents = 'all';
    requestAnimationFrame(() => {
      stationMenu.style.opacity = '1';
      stationMenu.style.transform = 'translateY(0)';
    });
  } else {
    // Hide menu with smooth transition
    stationMenu.style.opacity = '0';
    stationMenu.style.transform = 'translateY(-20px)';
    stationMenu.style.pointerEvents = 'none';
    
    // Hide completely after transition
    setTimeout(() => {
      if (!stationMenu.classList.contains('open')) {
        stationMenu.style.display = 'none';
      }
    }, 400);
  }
}

playBtn.addEventListener('click', () => {
  if (!player) {
    loadYT();
    return;
  }
  
  if (!isPlayerReady) {
    // Player is still loading, set flag to play when ready
    shouldAutoPlay = true;
    return;
  }
  
  const state = player.getPlayerState();
  if (state !== 1) player.playVideo(); // 1 = PLAYING
  else player.pauseVideo();
});

prevBtn.addEventListener('click', () => {
  changeStation('prev');
});

nextBtn.addEventListener('click', () => {
  changeStation('next');
});

menuToggle.addEventListener('click', () => {
  toggleMenu();
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!menuToggle.contains(e.target) && !stationMenu.contains(e.target)) {
    toggleMenu(false);
  }
});

// Volume slider with 3-second delay and click to hide
let volumeTimeout;
const volumeWrap = document.querySelector('.volumeWrap');

function hideVolumeSlider() {
  volSlider.style.opacity = '0';
  volSlider.style.pointerEvents = 'none';
  clearTimeout(volumeTimeout);
}

function showVolumeSlider() {
  volSlider.style.opacity = '1';
  volSlider.style.pointerEvents = 'auto';
  clearTimeout(volumeTimeout);
  
  // Auto-hide after 3 seconds
  volumeTimeout = setTimeout(hideVolumeSlider, 3000);
}

volumeWrap.addEventListener('mouseenter', showVolumeSlider);

volumeWrap.addEventListener('mouseleave', () => {
  volumeTimeout = setTimeout(hideVolumeSlider, 3000); // 3 seconds delay
});

// Hide slider when volume button is clicked
volBtn.addEventListener('click', hideVolumeSlider);

// Hide slider when clicking outside
document.addEventListener('click', (e) => {
  if (!volumeWrap.contains(e.target) && volSlider.style.opacity === '1') {
    hideVolumeSlider();
  }
});

volSlider.addEventListener('input', (e) => {
  if (player && player.setVolume) player.setVolume(parseFloat(e.target.value) * 100);
});
window.addEventListener('keydown', (e) => {
  // Prevent default behavior for our shortcuts
  if ([' ', 'k', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'f'].includes(e.key.toLowerCase())) {
    e.preventDefault();
  }
  
  // Fullscreen toggle
  if (e.key.toLowerCase() === 'f') {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }
  
  // Play/Pause - Space or K
  if (e.key.toLowerCase() === ' ' || e.key.toLowerCase() === 'k') {
    if (!player) {
      loadYT();
      return;
    }
    
    if (!isPlayerReady) {
      shouldAutoPlay = true;
      return;
    }
    
    const state = player.getPlayerState();
    if (state !== 1) player.playVideo(); // 1 = PLAYING
    else player.pauseVideo();
  }
  
  // Volume controls - Arrow Up/Down
  if (e.key.toLowerCase() === 'arrowup') {
    const newVolume = Math.min(1, parseFloat(volSlider.value) + 0.1);
    volSlider.value = newVolume;
    if (player && player.setVolume) player.setVolume(newVolume * 100);
  }
  
  if (e.key.toLowerCase() === 'arrowdown') {
    const newVolume = Math.max(0, parseFloat(volSlider.value) - 0.1);
    volSlider.value = newVolume;
    if (player && player.setVolume) player.setVolume(newVolume * 100);
  }
  
  // Station navigation - Arrow Left/Right
  if (e.key.toLowerCase() === 'arrowleft') {
    changeStation('prev');
  }
  
  if (e.key.toLowerCase() === 'arrowright') {
    changeStation('next');
  }
});

// Beat detection simulation variables with smoother animation
let beatPhase = 0;
let lastBeatTime = 0;
let beatInterval = 450; // ~133 BPM typical for lofi
let bassBoost = 0;
let midBoost = 0;
let waveOffset = 0;
let smoothBass = 0;
let smoothMid = 0;
let smoothHigh = 0;

function simulateBeatReactive() {
  const now = Date.now();
  const timeSinceLastBeat = now - lastBeatTime;
  
  // Generate beats at intervals with some randomness for natural feel
  if (timeSinceLastBeat > beatInterval + (Math.random() - 0.5) * 80) {
    lastBeatTime = now;
    beatInterval = 400 + Math.random() * 150; // Vary tempo slightly
    bassBoost = 1.0;
    beatPhase = 0;
  }
  
  // Decay the beat intensity with smoother curves
  bassBoost *= 0.92;
  midBoost = Math.sin(beatPhase) * 0.5 + 0.2;
  beatPhase += 0.15;
  
  // Smooth interpolation for less jittery animation
  const targetBass = Math.max(0, bassBoost);
  const targetMid = Math.max(0, midBoost);
  const targetHigh = Math.random() * 0.2 + 0.15;
  
  smoothBass += (targetBass - smoothBass) * 0.35;
  smoothMid += (targetMid - smoothMid) * 0.3;
  smoothHigh += (targetHigh - smoothHigh) * 0.25;
  
  waveOffset += 0.025; // Continuous wave movement
  
  return {
    bass: smoothBass,
    mid: smoothMid,
    high: smoothHigh,
    offset: waveOffset
  };
}

function drawWaveform(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  
  // Check if music is playing
  const isPlaying = player && player.getPlayerState && player.getPlayerState() === 1; // 1 = PLAYING
  
  if (isPlaying) {
    // Use beat-reactive simulation
    const beats = simulateBeatReactive();
    
    // Draw multiple waveform lines with improved colors and effects
    const centerY = canvas.height / 2;
    const numBars = Math.floor(canvas.width / 2.5);
    
    // Create gradient for better visual appeal
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, 'rgba(255, 107, 157, 0.8)');
    gradient.addColorStop(0.5, 'rgba(196, 69, 105, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 235, 59, 0.7)');
    
    // Bass line (thick, slow wave) - Main wave
    ctx.lineWidth = 4;
    ctx.strokeStyle = gradient;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let i = 0; i < numBars; i++) {
      const x = (i / numBars) * canvas.width;
      const amplitude = 15 + beats.bass * 25;
      const frequency = 0.006 + beats.bass * 0.003;
      const y = centerY + Math.sin(beats.offset + i * frequency) * amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Mid frequency line (smoother curves) - Secondary wave
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = `rgba(0,0,0,${0.2 + beats.mid * 0.3})`;
    ctx.beginPath();
    for (let i = 0; i < numBars * 1.8; i++) {
      const x = (i / (numBars * 1.8)) * canvas.width;
      const amplitude = 8 + beats.mid * 15;
      const frequency = 0.012 + beats.mid * 0.006;
      const y = centerY + Math.sin(beats.offset * 1.3 + i * frequency) * amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // High frequency sparkles (more fluid) - Detail waves
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = `rgba(255, 107, 157,${0.3 + beats.high * 0.4})`;
    ctx.beginPath();
    for (let i = 0; i < numBars * 3; i++) {
      const x = (i / (numBars * 3)) * canvas.width;
      const amplitude = 3 + beats.high * 8;
      const frequency = 0.02 + beats.high * 0.01;
      const y = centerY + Math.sin(beats.offset * 2.5 + i * frequency) * amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Secondary harmonics for depth - Background waves
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = `rgba(255, 235, 59,${0.15 + beats.bass * 0.2})`;
    ctx.beginPath();
    for (let i = 0; i < numBars; i++) {
      const x = (i / numBars) * canvas.width;
      const amplitude = 10 + beats.bass * 18;
      const frequency = 0.01;
      const y = centerY + Math.cos(beats.offset * 0.7 + i * frequency) * amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Enhanced beat indicators with pulsing effect
    if (beats.bass > 0.2) {
      for (let i = 0; i < 5; i++) {
        const x = (Math.sin(beats.offset + i * 0.5) * 0.4 + 0.5) * canvas.width;
        const y = centerY + (Math.cos(beats.offset * 1.2 + i * 0.3) * 25);
        const radius = beats.bass * 3 + 2;
        
        // Create radial gradient for beat indicators
        const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        radialGradient.addColorStop(0, `rgba(255, 107, 157, ${beats.bass * 0.8})`);
        radialGradient.addColorStop(1, 'rgba(255, 107, 157, 0)');
        
        ctx.fillStyle = radialGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Add subtle glow effect
    ctx.shadowColor = 'rgba(255, 107, 157, 0.3)';
    ctx.shadowBlur = 10;
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(255, 107, 157, ${0.1 + beats.bass * 0.1})`;
    ctx.beginPath();
    for (let i = 0; i < numBars; i++) {
      const x = (i / numBars) * canvas.width;
      const amplitude = 20 + beats.bass * 30;
      const frequency = 0.005;
      const y = centerY + Math.sin(beats.offset + i * frequency) * amplitude;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    
  } else {
    // Enhanced static wave when paused
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineCap = 'round';
    ctx.beginPath();
    const step = 2;
    for (let x = 0; x < canvas.width; x += step) {
      const y = canvas.height/2 + Math.sin(x/50) * 10;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Add subtle secondary wave
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 107, 157, 0.15)';
    ctx.beginPath();
    for (let x = 0; x < canvas.width; x += step) {
      const y = canvas.height/2 + Math.cos(x/40) * 6;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  
  requestAnimationFrame(drawWaveform);
}

function resizeCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = 80;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawWaveform();

// Double-tap to fullscreen for mobile
let lastTap = 0;
let tapCount = 0;

document.addEventListener('touchstart', (e) => {
  const currentTime = new Date().getTime();
  const tapLength = currentTime - lastTap;
  
  if (tapLength < 500 && tapLength > 0) {
    // Double tap detected
    e.preventDefault();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    tapCount = 0;
  } else {
    tapCount = 1;
  }
  lastTap = currentTime;
});

window.addEventListener('pointerdown', () => loadYT(), {once:true});
