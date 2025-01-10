document.addEventListener("DOMContentLoaded", () => {
    // Получаем контейнер для карточек
    const cardsContainer = document.getElementById("product-cards-container");

    // Загрузка продуктов с API
    fetch('http://127.0.0.1:5500/api/gifts')
        .then(response => response.json())
        .then(gifts => {
            gifts.forEach(gift => {
                // Создаем карточку для каждого букета
                const card = document.createElement("div");
                card.classList.add("product-card");

                card.innerHTML = `
                    <img src="/static/${gift.image}" alt="${gift.name}">
                    <div class="card-body">
                        <div class="product-name">${gift.name}</div>
                        <div class="product-price">${gift.price} руб.</div>
                        <button class="view-details-btn" data-id="${gift.id}">Подробнее</button>
                    </div>
                `;

                // Добавляем карточку в контейнер
                cardsContainer.appendChild(card);

                // Обработчик для кнопки "Подробнее"
                card.querySelector(".view-details-btn").addEventListener("click", () => {
                    const giftId = card.querySelector(".view-details-btn").getAttribute("data-id");
                    window.location.href = `/gift-details/${giftId}`;  // Редирект на страницу с подробной информацией
                });
            });
        })
        .catch(error => console.log('Ошибка при загрузке данных:', error));
});
