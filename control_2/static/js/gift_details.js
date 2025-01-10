document.addEventListener("DOMContentLoaded", () => {

    const path = window.location.pathname;
    const match = path.match(/\/(\d+)$/);
    const giftId = match[1];
    console.log(giftId);


    // Запрос на сервер для получения подробной информации о продукте
    fetch(`http://127.0.0.1:5500/api/gifts/${giftId}`)
        .then(response => response.json())
        .then(gift => {
            const giftDetails = document.getElementById("product-details");

            giftDetails.innerHTML = `
                <h2 class="product-name">${gift.name}</h2>
                <img src="/static//${gift.image}" alt="${gift.name}">
                <p class="product-price">${gift.price} руб.</p>
                <p class="product-ldescription">${gift.description}</p>
                <p class="product-stock">В наличии: ${gift.stock} шт.</p>
            `;
        })
        .catch(error => console.log('Ошибка при загрузке подробностей:', error));
});
