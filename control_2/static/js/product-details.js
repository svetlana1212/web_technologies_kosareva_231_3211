document.addEventListener("DOMContentLoaded", () => {
    // Получение параметра 'id' из URL
    const path = window.location.pathname;
    const match = path.match(/\/(\d+)$/);
    const productId = match[1];


    // Запрос на сервер для получения подробной информации о продукте
    fetch(`http://127.0.0.1:5500/api/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        })
        .then(product => {
            const productDetails = document.getElementById("product-details");

            productDetails.innerHTML = `
                <h2 class="product-name">${product.name}</h2>
                <img src="/static/${product.image}" alt="${product.name}">
                <p class="product-price">${product.price} руб.</p>
                <p class="product-ldescription">${product.long_description}</p>
                <p class="product-stock">В наличии: ${product.stock} шт.</p>
            `;
        })
        .catch(error => {
            console.error('Ошибка при загрузке подробностей:', error);
            const productDetails = document.getElementById("product-details");
            productDetails.innerHTML = `<p class="error">Error loading product details. Please try again later.</p>`;
        });
});
