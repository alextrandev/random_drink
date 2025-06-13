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
    const sets = 10;
    for (let s = 0; s < sets; s++) {
      drinks.forEach(name => {
        const div = document.createElement("div");
        div.className = "slide";
        div.textContent = name;
        slider.appendChild(div);
      });
    }
    const slides = slider.querySelectorAll('.slide');
    const container = document.querySelector('.slider-container');
    const slideWidth = container.clientWidth / 3; // three full slides visible
    // initial center offset (middle set)
    const initialOffset = slideWidth * drinks.length * Math.floor(sets / 2);
    slider.style.transform = `translateX(-${initialOffset}px)`;

    // remove old click handler
    btn.replaceWith(btn.cloneNode(true));
    const newBtn = document.getElementById('btn');
    newBtn.addEventListener('click', async () => {
      newBtn.disabled = true;
      drink.textContent = '';
      // reset position instantly
      slider.style.transition = 'none';
      slider.style.transform = `translateX(-${initialOffset}px)`;
      // force reflow
      void slider.offsetWidth;
      // compute dimensions
      const slideWidth = slides[0].clientWidth;
      // random final index and total steps
      const finalIdx = Math.floor(Math.random() * drinks.length);
      const totalSteps = drinks.length * 3 + finalIdx;
      const startOffset = initialOffset;
      const endOffset = startOffset + totalSteps * slideWidth;
      // calculate center position offset
      const centerOffset = (container.clientWidth - slideWidth) / 2;
      // final translate ensures chosen slide lands in center
      const finalTranslate = endOffset - centerOffset;
      // animate with single smooth transition
      slider.style.transition = 'transform 3s cubic-bezier(0.33, 1, 0.68, 1)';
      slider.style.transform = `translateX(-${finalTranslate}px)`;
      // wait for animation to finish
      await new Promise(res => setTimeout(res, 3000));
      // show chosen
      drink.textContent = drinks[finalIdx];
      newBtn.disabled = false;
    });