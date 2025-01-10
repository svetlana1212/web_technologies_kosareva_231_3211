function loadOrders() {
    fetch("https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders?api_key=d4f78d77-dc9e-488f-a090-8d40695dcec8")
        .then(response => response.json())
        .then(orders => {
            const tbody = document.getElementById('orders-table-body');
            orders.forEach(order => {
                const row = document.createElement('tr');

                let displayedId = 1;

                let datetime = `${(order.created_at).slice(0, 10)} ${(order.created_at).slice(11, -3)}`;

                row.innerHTML = `
                    <td>${displayedId++}</td>
                    <td>${datetime}</td>
                    <td>${order.name}</td>
                    <td>${order.actual_price}</td>
                    <td>${order.delivery_interval}</td>
                    <td>
                        <span class="action-btn" onclick="showDetails(this)" title="Подробнее"><img src="/icons/eye.svg" alt="Eye"></span>
                        <span class="action-btn" onclick="editOrder(this)" title="Редактировать"><img src="/icons/pencil.svg" alt="Pencil"></span>
                        <span class="action-btn" onclick="deleteOrder(this)" title="Удалить"><img src="/icons/trash3.svg" alt="Trash"></span>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading orders:', error));
}
// Функция для открытия модального окна редактирования
function editOrder(orderId) {
    // Получаем заказ по ID (пример с fetch)
    fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${orderId}?api_key=d4f78d77-dc9e-488f-a090-8d40695dcec8`)
        .then(response => response.json())
        .then(order => {
            // Заполняем форму редактирования
            document.getElementById('edit-order-id').value = order.id;
            document.getElementById('edit-full-name').value = order.full_name;
            document.getElementById('edit-email').value = order.email;
            document.getElementById('edit-phone').value = order.phone;
            document.getElementById('edit-address').value = order.address;
            document.getElementById('edit-date').value = order.created_at.split('T')[0]; // Преобразуем дату
            document.getElementById('edit-comment').value = order.comment;
            document.getElementById('edit-time').value = order.delivery_time;
            document.getElementById('edit-cost').value = order.actual_price;

            // Показываем модальное окно
            document.getElementById('edit-modal').style.display = 'block';
        })
        .catch(error => {
            showNotification('Ошибка при загрузке данных для редактирования', 'red');
        });
}

// Функция для сохранения отредактированного заказа
function saveOrder() {
    const orderId = document.getElementById('edit-order-id').value;
    const updatedOrder = {
        full_name: document.getElementById('edit-full-name').value,
        email: document.getElementById('edit-email').value,
        phone: document.getElementById('edit-phone').value,
        address: document.getElementById('edit-address').value,
        delivery_time: document.getElementById('edit-time').value,
        comment: document.getElementById('edit-comment').value,
        actual_price: document.getElementById('edit-cost').value,
    };

    // Отправляем PUT-запрос для сохранения изменений
    fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${orderId}?api_key=d4f78d77-dc9e-488f-a090-8d40695dcec8`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedOrder)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Обновляем данные в таблице
                updateTableRow(orderId, updatedOrder);
                showNotification('Заказ успешно обновлен', 'green');
                closeModal();
            } else {
                showNotification('Ошибка при обновлении заказа', 'red');
            }
        })
        .catch(error => {
            showNotification('Ошибка при обновлении заказа', 'red');
        });
}

// Функция для закрытия модального окна
// Функция для закрытия модальных окон
function closeModal() {
    document.getElementById('view-modal').style.display = 'none';
    document.getElementById('edit-modal').style.display = 'none';
    document.getElementById('delete-modal').style.display = 'none';
}

// Функция для открытия модального окна просмотра
function viewOrder(orderId) {
    fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${orderId}?api_key=d4f78d77-dc9e-488f-a090-8d40695dcec8`) // Подключаемся к API для получения данных заказа по ID
        .then(response => response.json())
        .then(order => {
            // Заполняем модальное окно данными заказа
            document.getElementById('view-order-id').textContent = order.id;
            document.getElementById('view-full-name').textContent = order.full_name;
            document.getElementById('view-email').textContent = order.email;
            document.getElementById('view-phone').textContent = order.phone;
            document.getElementById('view-address').textContent = order.address;
            document.getElementById('view-date').textContent = order.created_at.split('T')[0]; // Преобразуем дату
            document.getElementById('view-comment').textContent = order.comment;
            document.getElementById('view-time').textContent = order.delivery_time;
            document.getElementById('view-cost').textContent = order.actual_price;

            // Показываем модальное окно
            document.getElementById('view-modal').style.display = 'block';
        })
        .catch(error => {
            showNotification('Ошибка при загрузке данных для просмотра', 'red');
        });
}


// Функция для обновления строки в таблице
function updateTableRow(orderId, updatedOrder) {
    const row = document.querySelector(`#order-${orderId}`);
    row.querySelector('.order-full-name').textContent = updatedOrder.full_name;
    row.querySelector('.order-email').textContent = updatedOrder.email;
    row.querySelector('.order-phone').textContent = updatedOrder.phone;
    row.querySelector('.order-address').textContent = updatedOrder.address;
    row.querySelector('.order-date').textContent = updatedOrder.delivery_time;
    row.querySelector('.order-cost').textContent = updatedOrder.actual_price;
}

// Функция для удаления заказа
function deleteOrder(orderId) {
    // Показываем модальное окно подтверждения удаления
    document.getElementById('delete-modal').style.display = 'block';

    document.getElementById('delete-confirm-btn').onclick = function () {
        // Отправляем DELETE-запрос
        fetch(`https://edu.std-900.ist.mospolytech.ru/exam-2024-1/api/orders/${orderId}?api_key=d4f78d77-dc9e-488f-a090-8d40695dcec8`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Удаляем строку из таблицы
                    const row = document.querySelector(`#order-${orderId}`);
                    row.remove();
                    showNotification('Заказ успешно удален', 'green');
                    closeModal();
                } else {
                    showNotification('Ошибка при удалении заказа', 'red');
                }
            })
            .catch(error => {
                showNotification('Ошибка при удалении заказа', 'red');
            });
    };
}

// Функция для отображения уведомлений
function showNotification(message, color) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.style.backgroundColor = color;
    notification.classList.remove('hidden');

    // Скрыть уведомление через 5 секунд
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 5000);
}

// Функция для отмены удаления
function cancelDelete() {
    closeModal();
}

// Код для запуска редактирования и удаления заказов
document.querySelectorAll('.edit-order-btn').forEach(button => {
    button.onclick = function () {
        const orderId = button.dataset.orderId;
        editOrder(orderId);
    };
});

document.querySelectorAll('.delete-order-btn').forEach(button => {
    button.onclick = function () {
        const orderId = button.dataset.orderId;
        deleteOrder(orderId);
    };
});


window.onload = loadOrders;
