document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = "https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=d4f78d77-dc9e-488f-a090-8d40695dcec8";

    //создаем карточку товара
    function createProductCard(product) {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        //рейтинг
        function displayRating(rating) {
            const fullStar = '★';
            const emptyStar = '☆';
            const totalStars = 5;  //кол-во звезд всего

            let ratingScore = '';
            const fullStars = Math.floor(rating); //если 3.7, то получаем 3

            const halfStar = (rating - fullStars) >= 0.5 ? 1 : 0; // если дробь больше 0.5, то добавляем половину звезды

            const emptyStars = totalStars - fullStars - halfStar; //считаем сколько пустых звезд

            ratingScore += fullStar.repeat(fullStars);

            // добавляем половину звезды 
            if (halfStar === 1) {
                ratingScore += '⯨';
            }

            // добавляем пустые звезды
            ratingScore += emptyStar.repeat(emptyStars);

            return ratingScore;
        }

        function discountScore(actual_price, discount_price) {
            let discountScore = 0;
            if (discount_price) {
                const discountPercent = ((actual_price - discount_price) / actual_price) * 100;
                discountScore = `-${discountPercent.toFixed(0)}%`;

            } else {
                discountScore = '';
            }
            return discountScore;
        }

        // Формирование HTML карточки товара
        productCard.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}" class="product-image">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">${product.rating} ${displayRating(product.rating)}</div>
        <div class="product-price">
        <span class="actual-price ${product.discount_price ? 'discounted' : ''}">
            ${product.discount_price ? product.discount_price : product.actual_price} ₽
        </span>
        ${product.discount_price ? `<span class="discount-price">${product.actual_price} ₽</span><span class="discount"> ${discountScore(product.actual_price, product.discount_price)}</span>` : ''}
        </div>
        <button class="basket-btn">Добавить</button>
    `;


        // Добавляем обработчик на кнопку "Добавить в корзину"
        const addToBasketBtn = productCard.querySelector('.basket-btn');
        addToBasketBtn.addEventListener('click', () => {
            addToBasket(product);
        });

        return productCard;
    }

    // Функция для добавления товара в корзину
    function addToBasket(product) {
        let basket = JSON.parse(localStorage.getItem('basket')) || []; // Получаем корзину из localStorage или создаем пустую корзину
        basket.push(product); // Добавляем товар в корзину
        localStorage.setItem('basket', JSON.stringify(basket)); // Сохраняем корзину в localStorage

        alert('Товар добавлен в корзину'); // Уведомление

    }

    function filterProductsByCategory(products, selectedCategories) {
        if (selectedCategories.length === 0) return products; // если категории не выбраны, показываем все товары
        return products.filter(product => {
            // Предполагаем, что `product.categories` содержит массив категорий товара
            return selectedCategories.some(category => product.main_category.includes(category));
        });
    }

    function filterProductsByPrice(products, minPrice, maxPrice) {
        return products.filter(product => {
            const price = product.discount_price || product.actual_price; // Используем скидочную цену, если она есть
            return price >= minPrice && price <= maxPrice;
        });
    }

    function filterProductsByDiscount(products) {
        return products.filter(product => product.discount_price !== null);
    }


    function sortProducts(products, sortBy) {
        if (sortBy === 'popularity-desc') {
            return products.sort((a, b) => a.rating - b.rating); // по возрастанию рейтинга
        } else if (sortBy === 'popularity-asc') {
            return products.sort((a, b) => b.rating - a.rating); // по убыванию рейтинга
        } else if (sortBy === 'price-asc') {
            return products.sort((a, b) => (b.discount_price || b.actual_price) - (a.discount_price || a.actual_price)); // по возрастанию цены
        } else if (sortBy === 'price-desc') {
            return products.sort((a, b) => (a.discount_price || a.actual_price) - (b.discount_price || b.actual_price)); // по убыванию цены
        }
        return products; // если ничего не выбрано, возвращаем товары без изменений
    }


    // Функция для получения данных с API
    async function fetchProductData() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Ошибка при получении данных с API');
            }

            const data = await response.json();

            if (Array.isArray(data)) {
                addProductToCatalog(data);
                applyFilter(data);
            } else {
                console.error('Неверный формат данных');
            }
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
        }
    }

    function addProductToCatalog(products) {
        const productGrid = document.querySelector('.product-grid');
        productGrid.innerHTML = ''; // Очистить каталог
        products.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });
    }

    function applyFilter(allProducts) {
        const sortSelect = document.querySelector('#sort'); // Селектор сортировки
        const filterForm = document.querySelector('.filter-form'); // Форма фильтрации

        // Обработчик изменения сортировки
        sortSelect.addEventListener('change', () => {
            updateProductList(allProducts);
        });

        // Обработчик кнопки "Применить" (для фильтрации по категориям, цене и скидке)
        filterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            updateProductList(allProducts); // Обновить список товаров с учетом выбранных фильтров
        });
    }


    function updateProductList(allProducts) {
        // Получаем выбранные категории
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(checkbox => checkbox.value);

        // Получаем значения фильтров по цене
        const minPrice = parseFloat(document.querySelector('input[name="price_from"]').value) || 0;
        const maxPrice = parseFloat(document.querySelector('input[name="price_to"]').value) || Infinity;

        // Проверяем, выбраны ли только товары со скидками
        const discountOnly = document.querySelector('input[name="discount"]').checked;

        // Получаем выбранную сортировку
        const sortBy = document.querySelector('#sort').value;

        // Фильтруем товары по категориям, цене и скидке
        let filteredProducts = filterProductsByCategory(allProducts, selectedCategories);
        filteredProducts = filterProductsByPrice(filteredProducts, minPrice, maxPrice);

        if (discountOnly) {
            filteredProducts = filterProductsByDiscount(filteredProducts);
        }

        // Сортируем товары по выбранному критерию
        filteredProducts = sortProducts(filteredProducts, sortBy);

        // Обновляем каталог товаров
        addProductToCatalog(filteredProducts);
    }

    // Вызов функции для получения и отображения данных
    fetchProductData();
});
