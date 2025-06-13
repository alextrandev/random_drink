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
      "Sữa",
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
      btn.disabled = true;
      drink.textContent = '';
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
      slider.style.transition = 'transform 3s cubic-bezier(0.4, 0.0, 0.2, 1)';
      slider.style.transform = `translateX(-${finalPos}px)`;
      // wait for animation to end
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
      btn.disabled = false;
    });