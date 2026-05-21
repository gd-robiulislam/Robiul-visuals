document.addEventListener("DOMContentLoaded", () => {
  
  // =========================================================
  // 1. CINEMATIC PRELOADER
  // =========================================================
  window.addEventListener('load', () => {
    // Wait 1.4 seconds for the loading animation to finish, then slide it up
    setTimeout(() => {
      document.getElementById('preloader').classList.add('slide-up');
    }, 1400);
  });

  // =========================================================
  // 2. DYNAMIC CURSOR GLOW TRACKING
  // =========================================================
  const cursorGlow = document.querySelector(".cursor-glow");
  document.addEventListener("mousemove", (e) => {
    requestAnimationFrame(() => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  });

  // =========================================================
  // 3. DYNAMIC HEADER SCROLL EFFECT
  // =========================================================
  const nav = document.querySelector(".studio-nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.style.padding = "0.5rem 0";
      nav.style.background = "rgba(6, 10, 19, 0.95)";
      nav.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.5)";
    } else {
      nav.style.padding = "0";
      nav.style.background = "rgba(6, 10, 19, 0.8)";
      nav.style.boxShadow = "none";
    }
  });

  // =========================================================
  // 4. INTERACTIVE SCROLL REVEAL & 3D CARDS
  // =========================================================
  const projectCards = document.querySelectorAll(".project-card");
  
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target); 
      }
    });
  }, {
    threshold: 0.15 
  });

  projectCards.forEach(card => {
    // Initial hidden state
    card.style.opacity = "0";
    card.style.transform = "translateY(40px)";
    card.style.transition = "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease";
    revealOnScroll.observe(card);

    // 3D Magnetic Card Logic
    const thumb = card.querySelector('.project-thumb');
    
    // 🔥 SAFETY CHECK: Only activate mouse listeners if a thumbnail image wrapper exists
    if (thumb) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -8; 
        const rotateY = ((x - centerX) / centerX) * 8;
        
        thumb.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        thumb.style.transition = 'none'; 
      });

      card.addEventListener('mouseleave', () => {
        thumb.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        thumb.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      });
    }
  });

  // =========================================================
  // 5. WEB AUDIO UI SYNTHESIS (FIXED)
  // =========================================================
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx;
  let isAudioUnlocked = false;

  function playUiTick() {
    if (!audioCtx || !isAudioUnlocked) return; 
    
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  }

  function unlockAudio() {
    if (isAudioUnlocked) return;
    
    audioCtx = new AudioContext();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    gain.gain.value = 0; 
    osc.start();
    osc.stop(audioCtx.currentTime + 0.01);

    isAudioUnlocked = true;
    
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  }

  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);

  const interactiveElements = document.querySelectorAll('a, button, .project-card, .btn-submit-ticket');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', playUiTick);
  });

// =========================================================
  // 6. MAGNETIC BUTTON PHYSICS
  // =========================================================
  const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-nav-ticket, .btn-submit-ticket');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      
      // Calculate the distance from the center of the button to the cursor
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Multiply by a friction factor (0.3) so it gently pulls instead of flying away
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      
      // Remove transition so it tracks the mouse instantly without lagging
      btn.style.transition = 'none'; 
    });

    btn.addEventListener('mouseleave', () => {
      // Snap back to the absolute center when the mouse leaves
      btn.style.transform = 'translate(0px, 0px)';
      
      // Add a heavy, smooth spring curve for the snap-back
      btn.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'; 
    });
  });

});