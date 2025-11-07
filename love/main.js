// You can change global variables here:
var radius = 240; // how big of the radius
var autoRotate = true; // auto rotate or not
var rotateSpeed = -60; // unit: seconds/360 degrees
var imgWidth = 120; // width of images (unit: px)
var imgHeight = 170; // height of images (unit: px)

// ===================== start =======================
// animation start after 1000 miliseconds
setTimeout(init, 1000);

var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; // combine 2 arrays

// Size of images
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Size of ground - depend on radius
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

function applyTranform(obj) {
  // Constrain the angle of camera (between 0 and 180)
  if(tY > 180) tY = 180;
  if(tY < 0) tY = 0;

  // Apply the angle while maintaining center position
  obj.style.transform = "translate(-50%, -50%) rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

function playSpin(yes) {
  ospin.style.animationPlayState = (yes?'running':'paused');
}

var sX, sY, nX, nY, desX = 0,
    desY = 0,
    tX = 0,
    tY = 10;

// auto spin
if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

// Background music is handled by the music player

// setup events
document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  var sX = e.clientX,
      sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    var nX = e.clientX,
        nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function (e) {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };

  return false;
};

document.onmousewheel = function(e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};



















// Canvas effects are handled by inline script in HTML

// Enhanced Spotify-style Music Player Functionality
document.addEventListener('DOMContentLoaded', function() {
    const audio = document.getElementById('myAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressSlider = document.getElementById('progressSlider');
    const progressFill = document.getElementById('progressFill');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const volumeSlider = document.getElementById('volumeSlider');
    
    let isPlaying = false;
    let userHasInteracted = false;
    
    // Element validation
    if (!audio || !playPauseBtn || !volumeSlider) {
        return;
    }
    
    // Set initial volume
    audio.volume = 0.7;
    volumeSlider.value = 70;
    audio.currentTime = 0;
    
    // Force load the audio
    audio.load();
    
    // Simple autoplay function (same as main page)
    const attemptAutoplay = async () => {
        try {
            audio.volume = 0.7;
            audio.muted = false;
            
            await audio.play();
            playPauseBtn.textContent = '⏸️';
            isPlaying = true;
            
        } catch (error) {
            // Fallback: play on next click (same as main page)
            document.addEventListener('click', () => {
                audio.muted = false;
                audio.volume = 0.7;
                audio.play().then(() => {
                    playPauseBtn.textContent = '⏸️';
                    isPlaying = true;
                }).catch(e => {});
            }, { once: true });
        }
    };
    
    // Clean up function (no hints to remove)
    const removePlayHint = () => {
        playPauseBtn.style.animation = '';
    };
    
    // Try autoplay immediately (same timing as main page)
    setTimeout(attemptAutoplay, 100);
    
    // Format time helper function
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Simple Play/Pause functionality (same as main page approach)
    playPauseBtn.addEventListener('click', function() {
        removePlayHint();
        
        if (isPlaying) {
            audio.pause();
            playPauseBtn.textContent = '▶️';
            isPlaying = false;
        } else {
            audio.muted = false;
            audio.volume = volumeSlider.value / 100;
            
            audio.play().then(() => {
                playPauseBtn.textContent = '⏸️';
                isPlaying = true;
            }).catch(error => {
                playPauseBtn.textContent = '▶️';
                isPlaying = false;
            });
        }
    });
    
    // Previous/Next buttons (for now just restart the song)
    prevBtn.addEventListener('click', function() {
        audio.currentTime = 0;
    });
    
    nextBtn.addEventListener('click', function() {
        audio.currentTime = 0;
        if (!isPlaying) {
            audio.play().then(() => {
                playPauseBtn.textContent = '⏸️';
                isPlaying = true;
            });
        }
    });
    
    // Progress bar functionality
    audio.addEventListener('loadedmetadata', function() {
        totalTimeEl.textContent = formatTime(audio.duration);
        progressSlider.max = audio.duration;
    });
    
    audio.addEventListener('timeupdate', function() {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = progress + '%';
        progressSlider.value = audio.currentTime;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });
    
    progressSlider.addEventListener('input', function() {
        audio.currentTime = progressSlider.value;
    });
    
    // Click on progress bar to seek
    const progressBar = document.querySelector('.progress-bar');
    progressBar.addEventListener('click', function(e) {
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const clickPercent = clickX / width;
        const newTime = clickPercent * audio.duration;
        audio.currentTime = newTime;
    });
    
    // Volume control
    volumeSlider.addEventListener('input', function() {
        const volumeValue = volumeSlider.value / 100;
        audio.volume = volumeValue;
        
        // Unmute if volume is changed from 0
        if (volumeValue > 0 && audio.muted) {
            audio.muted = false;
        }
        
        // Update volume icon based on level
        const volumeIcon = document.querySelector('.volume-icon');
        if (volumeValue === 0 || audio.muted) {
            volumeIcon.textContent = '🔇';
        } else if (volumeValue < 0.5) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    });
    
    volumeSlider.addEventListener('change', function() {
        const volumeValue = volumeSlider.value / 100;
        audio.volume = volumeValue;
        
        // Unmute if volume is changed from 0
        if (volumeValue > 0 && audio.muted) {
            audio.muted = false;
        }
    });
    
    // Click volume icon to mute/unmute
    const volumeIcon = document.querySelector('.volume-icon');
    volumeIcon.addEventListener('click', function() {
        if (audio.muted) {
            audio.muted = false;
            volumeSlider.value = audio.volume * 100;
            volumeIcon.textContent = audio.volume < 0.5 ? '🔉' : '🔊';
        } else {
            audio.muted = true;
            volumeIcon.textContent = '🔇';
        }
    });
    
    // Enhanced audio event handling
    audio.addEventListener('canplay', function() {
        if (totalTimeEl && !isNaN(audio.duration)) {
            totalTimeEl.textContent = formatTime(audio.duration);
        }
    });
    
    audio.addEventListener('play', function() {
        playPauseBtn.textContent = '⏸️';
        isPlaying = true;
    });
    
    audio.addEventListener('pause', function() {
        playPauseBtn.textContent = '▶️';
        isPlaying = false;
    });
    
    audio.addEventListener('ended', function() {
        playPauseBtn.textContent = '▶️';
        isPlaying = false;
        audio.currentTime = 0;
        
        // Auto-restart since it's a birthday song
        setTimeout(() => {
            if (userHasInteracted) {
                audio.play().catch(e => {});
            }
        }, 1000);
    });
    
    audio.addEventListener('error', function(e) {
        playPauseBtn.textContent = '❌';
    });
});