const drinks = [
      "Milo",
      "Matcha",
      "Soda",
      "Cacao",
      "Vitamin",
      "Trà sữa",
      "Cà phê",
      "Trà",
      "Matcha gói",
      "Cà phê trứng",
      "Nước lọc",
      "Sinh tố",
      "Sữa tươi trân châu",
      "Trà hoa quả",
      "Sữa chua đánh đá"
    ];
    const btn = document.getElementById("btn");
    const drink = document.getElementById("drink");
    
    // slider setup: duplicate sets for seamless carousel
    const slider = document.getElementById("slider");
    const sets = 7; // loops*2+1 ensures enough slides for spin
    slides = [];
    for (let s = 0; s < sets; s++) {
      drinks.forEach(name => {
        const div = document.createElement("div");
        div.className = "slide";
        div.textContent = name;
        slider.appendChild(div);
      });
    }
    const slideElems = slider.querySelectorAll('.slide');
    const container = document.querySelector('.slider-container');
    const marker = document.querySelector('.marker');

    // compute dimensions
    const slideWidth = slideElems[0].clientWidth;
    const centerOffset = container.clientWidth / 2 - slideWidth / 2;
    // apply padding to container for partial slides
    container.style.paddingLeft = `${centerOffset}px`;
    container.style.paddingRight = `${centerOffset}px`;

    // initial offset: center the middle set
    const totalSlides = drinks.length * sets;
    const startIndex = drinks.length * Math.floor(sets / 2);
    const initialOffset = startIndex * slideWidth;
    slider.style.transition = 'none';
    slider.style.transform = `translateX(-${initialOffset}px)`;

    // click handler
    btn.addEventListener('click', async () => {
      // remove ongoing pop effect if any
      drink.classList.remove('pop');
      // stop any ongoing confetti
      if (window.confettiInterval) {
        clearInterval(window.confettiInterval);
        window.confettiInterval = null;
      }
      btn.disabled = true;
      drink.textContent = '???';
      // reset to center instantly
      slider.style.transition = 'none';
      slider.style.transform = `translateX(-${initialOffset}px)`;
      void slider.offsetWidth;
      // pick random index and compute final position
      const finalIdx = Math.floor(Math.random() * drinks.length);
      const loops = 3;
      const targetIndex = startIndex + loops * drinks.length + finalIdx;
      const finalTranslate = targetIndex * slideWidth;
      // add random offset within slide to shift marker randomly inside it
      const randomOffset = (Math.random() - 0.5) * slideWidth * 0.6; // ±30% of slide width
      const finalPos = finalTranslate - randomOffset;

      // animate with acceleration then deceleration
      slider.style.transition = 'transform 4s cubic-bezier(0.4, 0.0, 0.1, 1)';
      slider.style.transform = `translateX(-${finalPos}px)`;
      // detect bump: poll slider transform and detect slide index changes
      let done = false;
      const onEnd = () => { done = true; };
      slider.addEventListener('transitionend', onEnd, { once: true });
      let prevIndex = startIndex;
      let startTime = Date.now();
      let isStuckLeft = false;
      function poll() {
        const style = window.getComputedStyle(slider);
        const matrix = new DOMMatrixReadOnly(style.transform);
        const currentOffset = -matrix.m41;
        const currentIndex = Math.round(currentOffset / slideWidth);
        const now = Date.now();
        const timeElapsed = now - startTime;
        const speed = Math.abs(currentIndex - prevIndex);
        
        if (currentIndex !== prevIndex) {
          prevIndex = currentIndex;
          
          // if spinning fast in first 1.5s, stick left
          if (timeElapsed < 2000 && speed > 0) {
            if (!isStuckLeft) {
              marker.classList.remove('bump');
              marker.classList.add('stuck-left');
              isStuckLeft = true;
            }
          } else {
            // normal bumping when slower
            if (isStuckLeft) {
              marker.classList.remove('stuck-left');
              isStuckLeft = false;
            }
            // quick bump and bounce back for final slow movements
            marker.classList.remove('bump');
            marker.classList.add('bump');
            setTimeout(() => marker.classList.remove('bump'), 300);
         }
        }
        if (!done) requestAnimationFrame(poll);
      }
      poll();
      // wait for animation end
      await new Promise(res => slider.addEventListener('transitionend', res, { once: true }));
      // detect slide under center marker
      const containerRect = container.getBoundingClientRect();
      const markerX = containerRect.left + containerRect.width / 2;
      let selected = '';
      slideElems.forEach(sl => {
        const rect = sl.getBoundingClientRect();
        if (markerX >= rect.left && markerX <= rect.right) selected = sl.textContent;
      });
      drink.textContent = selected;
      // pop animation: re-trigger by removing and adding class
      drink.classList.remove('pop');
      void drink.offsetWidth;
      drink.classList.add('pop');
      // initial confetti bursts
      const bursts = 5;
      for (let i = 0; i < bursts; i++) {
        confetti({
          particleCount: 150,
          spread: 360,
          startVelocity: 60,
          origin: { x: Math.random(), y: Math.random() * 0.8 }
        });
      }
      // continuous confetti every 0.25s for 5 seconds
      window.confettiInterval = setInterval(() => {
        confetti({
          particleCount: 50,
          spread: 360,
          startVelocity: 40,
          origin: { x: Math.random(), y: Math.random() }
        });
      }, 250);
      setTimeout(() => {
        if (window.confettiInterval) {
          clearInterval(window.confettiInterval);
          window.confettiInterval = null;
        }
      }, 5000);
      btn.disabled = false;
    });