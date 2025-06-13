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
    btn.addEventListener("click", () => {
      const randomIndex = Math.floor(Math.random() * drinks.length);
      drink.textContent = drinks[randomIndex];
    });