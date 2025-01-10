document.addEventListener('DOMContentLoaded', () => {
    const basketItemsContainer = document.querySelector('.basket-items');
    const totalPriceContainer = document.querySelector('.form-group.total');
    let basket = JSON.parse(localStorage.getItem('basket')) || []; // Получаем корзину из localStorage

    let totalPrice = 0;
    let baseDeliveryPrice = 200;  // Базовая стоимость доставки

    // Функция для расчета стоимости доставки
    function calculateDeliveryPrice(date, time) {
        let deliveryPrice = baseDeliveryPrice;  // Сбросить стоимость доставки при каждом изменении

        // Получаем день недели (0 - воскресенье, 1 - понедельник, ..., 6 - суббота)
        const deliveryDate = new Date(date);
        const dayOfWeek = deliveryDate.getDay();  // Получаем день недели

        // Проверка на выходной день (суббота и воскресенье)
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            deliveryPrice += 300; // Если выходной, добавляем 300 руб.
        }

        // Проверяем выбранный интервал времени
        if (time === "18-22") {
            deliveryPrice += 200; // Если вечернее время, добавляем 200 руб.
        }

        // Обновляем стоимость доставки в интерфейсе
        totalPriceContainer.innerHTML = `
            <label>Итоговая стоимость товаров: ${totalPrice} ₽</label>
            <span>(стоимость доставки: ${deliveryPrice} ₽)</span>
        `;
    }

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

    // Функция для отображения товаров в корзине
    function renderBasket() {
        basketItemsContainer.innerHTML = '';  // Очищаем корзину перед рендером
        totalPrice = 0;  // Сбрасываем общую цену товаров

        if (basket.length === 0) {
            basketItemsContainer.innerHTML = '<p>Ваша корзина пуста</p>';
        } else {
            basket.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.classList.add('basket-item');
                itemElement.innerHTML = `
                    <div class="basket-item-details">
                        <img src="${item.image_url}" alt="${item.name}" class="product-image">
                        <div>
                        <h3 class="product-name">${item.name}</h3>
                        <div class="product-rating">${item.rating} ${displayRating(item.rating)}</div>
                        <div class="product-price">
                        <span class="actual-price ${item.discount_price ? 'discounted' : ''}">
                        ${item.discount_price ? item.discount_price : item.actual_price} ₽
                        </span>
                        ${item.discount_price ? `<span class="discount-price">${item.actual_price} ₽</span><span class="discount"> ${discountScore(item.actual_price, item.discount_price)}</span>` : ''}
                        </div>
                    </div>
                `;
                basketItemsContainer.appendChild(itemElement);

                // Суммируем стоимость товаров
                totalPrice += item.discount_price ? item.discount_price : item.actual_price;
            });
        }

        // Отображаем общую стоимость без доставки
        totalPriceContainer.innerHTML = `
            <label>Итоговая стоимость товаров: ${totalPrice} ₽</label>
            <span>(стоимость доставки: ${baseDeliveryPrice} ₽)</span>
        `;
    }

    // Вызов функции для отображения корзины
    renderBasket();

    // Обработчик клика на кнопку "Удалить"
    basketItemsContainer.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains('basket-btn')) {
            const itemIndex = e.target.getAttribute('data-index'); // Получаем индекс товара из data-атрибута

            // Удаляем товар из корзины по индексу
            basket.splice(itemIndex, 1);

            // Обновляем корзину в localStorage
            localStorage.setItem('basket', JSON.stringify(basket));

            // Перерисовываем корзину
            renderBasket();
        }
    });


    // Сброс формы и корзины
    document.querySelector('.reset-btn').addEventListener('click', () => {
        // Очищаем корзину
        basket = [];
        localStorage.removeItem('basket');
        totalPrice = 0;
        console.log(basket);
        console.log(totalPrice);

        // Перерисовываем корзину
        renderBasket();

        // Сбрасываем стоимость доставки в интерфейсе
        totalPriceContainer.innerHTML = `
            <label>Итоговая стоимость товаров: 0 ₽</label>
            <span>(стоимость доставки: ${baseDeliveryPrice} ₽)</span>
        `;
    });


    // Добавляем обработчик изменения даты доставки
    const deliveryDateInput = document.querySelector('#date');
    const deliveryTimeInput = document.querySelector('#time');

    deliveryDateInput.addEventListener('change', () => {
        const selectedDate = deliveryDateInput.value;
        const selectedTime = deliveryTimeInput.value;

        // Перерасчитываем стоимость доставки
        calculateDeliveryPrice(selectedDate, selectedTime);
    });

    // Добавляем обработчик изменения времени доставки
    deliveryTimeInput.addEventListener('change', () => {
        const selectedDate = deliveryDateInput.value;
        const selectedTime = deliveryTimeInput.value;

        // Перерасчитываем стоимость доставки
        calculateDeliveryPrice(selectedDate, selectedTime);
    });

    // Обработчик формы оформления заказа
    document.querySelector('.form-buttons').addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.querySelector('#name').value.trim();
        const phone = document.querySelector('#phone').value.trim();
        const email = document.querySelector('#email').value.trim();
        const address = document.querySelector('#address').value.trim();
        const date = document.querySelector('#date').value.trim();
        const time = document.querySelector('#time').value.trim();
        const comment = document.querySelector('#comment').value.trim();
        const subscribe = document.querySelector('#subscribe').checked ? 1 : 0; // Преобразуем в 0 или 1

        // Проверка на заполнение обязательных полей
        if (!name || !phone || !email || !address || !date || !time) {
            alert('Пожалуйста, заполните все обязательные поля.');
            return;
        }

        // Проверка формата даты (dd.mm.yyyy)
        const datePattern = /^\d{2}\.\d{2}\.\d{4}$/;
        if (!datePattern.test(date)) {
            alert('Дата должна быть в формате dd.mm.yyyy');
            return;
        }

        // Проверка допустимых значений времени доставки
        const validIntervals = ["08:00-12:00", "12:00-14:00", "14:00-18:00", "18:00-22:00"];
        if (!validIntervals.includes(time)) {
            alert('Недопустимое значение времени доставки.');
            return;
        }

        // Подготовка данных для отправки
        const requestData = {
            full_name: name,
            phone: phone,
            email: email,
            delivery_address: address,
            delivery_date: date,
            delivery_interval: time,
            comment: comment,
            subscribe: subscribe,
            good_ids: basket.map(item => item.id)  // Предполагаем, что basket уже определен
        };

        // Выполнение POST-запроса
        fetch('https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=d4f78d77-dc9e-488f-a090-8d40695dcec8', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.id) {
                    alert(`Заказ успешно оформлен! Номер заказа: ${data.id}.`);

                    // Очистка корзины в localStorage
                    localStorage.removeItem('basket');
                    totalPrice = 0;

                    // Перенаправление на главную страницу
                    window.location.href = '/index.html';
                } else {
                    throw new Error('Ошибка сервера');
                }
            })
            .catch(error => {
                alert(`Произошла ошибка при оформлении заказа: ${error.message}`);
            });
    });

});
