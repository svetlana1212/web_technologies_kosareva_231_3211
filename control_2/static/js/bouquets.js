document.addEventListener("DOMContentLoaded", () => {
    // Получаем контейнер для карточек
    const cardsContainer = document.getElementById("product-cards-container");

    // Загрузка продуктов с API
    fetch('http://127.0.0.1:5500/api/products')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                // Создаем карточку для каждого букета
                const card = document.createElement("div");
                card.classList.add("product-card");

                card.innerHTML = `
                    <img src="/static/${product.image}" alt="${product.name}">
                    <div class="card-body">
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">${product.price} руб.</div>
                        <div class="product-description">${product.short_description}</div>
                        <button class="view-details-btn" data-id="${product.id}">Подробнее</button>
                    </div>
                `;

                // Добавляем карточку в контейнер
                cardsContainer.appendChild(card);

                // Обработчик для кнопки "Подробнее"
                card.querySelector(".view-details-btn").addEventListener("click", () => {
                    const productId = card.querySelector(".view-details-btn").getAttribute("data-id");
                    window.location.href = `/product-details/${productId}`;
                });
            });
        })
        .catch(error => console.log('Ошибка при загрузке данных:', error));
});
