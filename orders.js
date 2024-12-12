document.addEventListener('DOMContentLoaded', function () {
    fetchOrders();
});

let dishDictionary = {};
let dishPrice = {};
function getDishArray() {

    fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes')
        .then(response => response.json())
        .then(data => {
            data.forEach(dish => {
                dishDictionary[String(dish.id)] = dish.name;
                dishPrice[String(dish.id)] = dish.price;
            })
        })
        .catch(error => {
            console.error('Ошибка при загрузке списка блюд:', error);
        });
}

getDishArray();



function fetchOrders() {
    fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=d4f78d77-dc9e-488f-a090-8d40695dcec8', {
        method: 'GET',
    })
        .then(response => response.json())  // Преобразуем ответ в формат JSON
        .then(data => {
            // Очистим таблицу перед добавлением новых данных
            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = '';

            // Счётчик для ID заказов
            let displayedId = 1;

            // Функция для подсчёта стоимости заказа
            function calculateOrderPrice(dishIds) {
                return dishIds
                    .filter(id => id) // Исключаем `null` или `undefined`
                    .reduce((total, id) => total + (dishPrice[String(id)] || 0), 0);
            }

            function getDishNameById(id) {
                return dishDictionary[String(id)];

            }
            // Перебираем полученные данные и создаем строки таблицы
            data.forEach(order => {
                const row = document.createElement('tr');


                // Добавляем данные в соответствующие ячейки
                row.dataset.id = order.id;
                row.dataset.fullName = order.full_name;
                row.dataset.date = order.created_at;
                row.dataset.email = order.email;
                row.dataset.phone = order.phone;
                row.dataset.address = order.delivery_address;;

                console.log(order);


                // Получаем названия блюд по их ID
                const dishIds = [order.soup_id, order.main_course_id, order.salad_id, order.drink_id, order.dessert_id];
                const order_items = dishIds.map(id => id ? getDishNameById(id) : '');
                const orderPrice = calculateOrderPrice(dishIds);

                // Собираем строку из заказанных блюд
                const orderItemsString = order_items.filter(item => item !== '').join(', ');

                row.dataset.cost = `${orderPrice}₽`;
                row.dataset.order = orderItemsString;

                let deliveryText = order.delivery_type === 'now'
                    ? 'Как можно скорее \n (с 07:00 до 23:00)'
                    : order.delivery_time;

                let deliveryType = order.delivery_type === 'now' ? 'Как можно скорее' : 'Ко времени';
                row.dataset.type = deliveryType;

                row.dataset.time = deliveryText;

                let datetime = `${(order.created_at).slice(0, 10)} ${(order.created_at).slice(11, -3)}`;

                let commentOrder = order.comment === null ? '' : order.comment;

                row.dataset.comment = commentOrder;

                row.innerHTML = `
                <td>${displayedId++}</td>
                <td>${datetime}</td>
                <td>${orderItemsString}</td>
                <td>${orderPrice}₽</td>
                <td>${deliveryText}</td>
                <td>
                    <span class="action-btn" onclick="showDetails(this)" title="Подробнее"><img src="eye.svg" alt="Eye"></span>
                    <span class="action-btn" onclick="editOrder(this)" title="Редактировать"><img src="pencil.svg" alt="Pencil"></span>
                    <span class="action-btn" onclick="deleteOrder(this)" title="Удалить"><img src="trash3.svg" alt="Trash"></span>
                </td>
            `;

                // Добавляем строку в таблицу
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке заказов:', error);
            alert('Не удалось загрузить заказы.');
        });

}




function openModal(type) {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById(type + '-modal').style.display = 'block';
}


function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
}

// Просмотр деталей заказа
function showDetails(button) {
    const row = button.closest('tr');

    document.getElementById('details-date').textContent = row.cells[1].textContent;
    document.getElementById('details-full-name').textContent = row.dataset.fullName;
    document.getElementById('details-address').textContent = row.dataset.address;
    document.getElementById('details-type').textContent = row.dataset.type;
    document.getElementById('details-time').textContent = row.dataset.time;
    document.getElementById('details-phone').textContent = row.dataset.phone;
    document.getElementById('details-email').textContent = row.dataset.email;
    document.getElementById('details-comment').textContent = row.dataset.comment || '';
    document.getElementById('details-order').textContent = row.dataset.order;
    document.getElementById('details-cost').textContent = row.dataset.cost;

    openModal('view');
}

// Редактирование заказа
function editOrder(button) {
    const row = button.closest('tr');
    openModal('edit');

    document.getElementById('edit-order-id').value = row.dataset.id;  // Заполняем ID заказа для редактирования
    document.getElementById('edit-date').value = row.cells[1].textContent;
    document.getElementById('edit-full-name').value = row.dataset.fullName;
    document.getElementById('edit-address').value = row.dataset.address;
    document.getElementById('edit-type-asap').checked = row.dataset.type === "Как можно скорее";
    document.getElementById('edit-type-time').checked = row.dataset.type === "Ко времени";
    document.getElementById('edit-time').value = row.dataset.time;
    document.getElementById('edit-phone').value = row.dataset.phone;
    document.getElementById('edit-email').value = row.dataset.email;
    document.getElementById('edit-comment').value = row.dataset.comment;
    document.getElementById('edit-order').value = row.dataset.order;
    document.getElementById('edit-cost').value = row.dataset.cost;

    ///openModal('edit');
}


// Сохранение изменений
function saveOrder() {
    const orderId = document.getElementById('edit-order-id').value; // Получаем ID заказа
    if (!orderId) {
        console.error('ID заказа не найден.');
        return;
    }
    const fullName = document.getElementById('edit-full-name').value;
    const address = document.getElementById('edit-address').value;
    let deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;

    if (deliveryType === 'Как можно скорее') {
        deliveryType = 'now';
    } else {
        deliveryType = 'by_time';
    }

    const deliveryTime = document.getElementById('edit-time').value;
    const phone = document.getElementById('edit-phone').value;
    const email = document.getElementById('edit-email').value;
    const comment = document.getElementById('edit-comment').value;
    const order = document.getElementById('edit-order').value;
    const cost = document.getElementById('edit-cost').value;

    // Создаем объект FormData
    const formData = new FormData();

    // Добавляем данные в FormData
    formData.append('full_name', fullName);
    formData.append('delivery_address', address);
    formData.append('delivery_type', deliveryType);
    formData.append('delivery_time', deliveryTime);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('comment', comment);
    formData.append('order', order);
    formData.append('cost', parseFloat(cost));  // Стоимость должна быть числом

    // Отправляем данные на сервер для обновления заказа
    fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${orderId}?api_key=d4f78d77-dc9e-488f-a090-8d40695dcec8`, {
        method: 'PUT',
        body: formData, // Передаем FormData в теле запроса
    })
        .then(response => {
            if (!response.ok) throw new Error('Не удалось обновить заказ');
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data['error']) {
                alert(data['error']);
            } else {
                alert('Изменения сохранены!');
                closeModal(); // Закрыть модальное окно
                location.reload();
            }
        })
        .catch((error) => {
            console.error('Ошибка при обновлении заказа:', error);
            alert('Произошла ошибка при сохранении изменений.');
        })

}

// Удаление заказа
function deleteOrder(button) {
    const row = button.closest('tr');
    openModal('delete'); // Открыть окно "Удаление"

    const orderId = row.dataset.id; // Получаем ID заказа
    if (!orderId) {
        console.error('ID заказа не найден.');
        return;
    }

    // Сохраняем ID заказа в переменную
    orderIdToDelete = orderId;
}
// Подтверждение удаления
function confirmDelete() {
    if (!orderIdToDelete) {
        console.error('ID заказа не найден.');
        return;
    }

    // Отправляем запрос на удаление
    fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${orderIdToDelete}?api_key=d4f78d77-dc9e-488f-a090-8d40695dcec8`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then((data) => {
            if (data['error']) {
                alert(data['error']);
            } else {
                alert('Заказ удалён!');
                closeModal();
                location.reload(); // Перезагружаем страницу после успешного удаления
            }
        })
        .catch((error) => {
            alert('Ошибка при удалении заказа: ' + error);
        });
}