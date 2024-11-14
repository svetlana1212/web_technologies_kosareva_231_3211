document.addEventListener('DOMContentLoaded', () => {
    loadDishes();
});

async function loadDishes() {
    try {
        const response = await fetch("http://lab7-api.std-900.ist.mospolytech.ru/api/dishes");

        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        const data = await response.json();

        const sortedFood = data.sort((a, b) => {
            return a['name'].localeCompare(b['name'], 'ru');
        });

        const SectionSoups = document.querySelectorAll('.grid')[0];
        const SectionMain = document.querySelectorAll('.grid')[1];
        const SectionSalad = document.querySelectorAll('.grid')[2];
        const SectionJuice = document.querySelectorAll('.grid')[3];
        const SectionDessert = document.querySelectorAll('.grid')[4];

        function TicketsMake(dish) {
            const ticket = document.createElement('div');
            ticket.classList.add('flex');
            ticket.dataset.kind = dish['kind'];

            const img = document.createElement('img');
            img.src = dish['image'];
            img.alt = dish['name'];

            const price = document.createElement('p');
            price.classList.add('price');
            price.textContent = dish['price'] + '₽';

            const food = document.createElement('p');
            food.classList.add('food');
            food.textContent = dish['name'];

            const weight = document.createElement('p');
            weight.classList.add('count');
            weight.textContent = dish['count'];

            const button = document.createElement('button');
            button.textContent = "Добавить";

            ticket.appendChild(img);
            ticket.appendChild(price);
            ticket.appendChild(food);
            ticket.appendChild(weight);
            ticket.appendChild(button);

            button.addEventListener('click', () => {
                GetOrder(dish);
            });

            return ticket;
        }

        function GoTickets(ElemSection, category) {
            sortedFood.forEach(dish => {
                if (dish['category'] === category) {
                    const ticket = TicketsMake(dish);
                    ElemSection.appendChild(ticket);
                }
            });
        }

        GoTickets(SectionSoups, 'soup');
        GoTickets(SectionMain, 'main-course');
        GoTickets(SectionSalad, 'salad');
        GoTickets(SectionJuice, 'drink');
        GoTickets(SectionDessert, 'dessert');

        let FoodPrice = 0;
        const FoodPriceElements = document.getElementById('food_price');
        const PriceCount = document.getElementById('price');

        let ChosenFood = {
            'soup': null,
            'main-course': null,
            'salad': null,
            'drink': null,
            'dessert': null,
        };

        const SoupLabel = document.getElementById('soup-select');
        const ChosenSoup = document.getElementById('soup-selected');
        const MainLabel = document.getElementById('main-select');
        const ChosenSalad = document.getElementById('salad-selected');
        const SaladLabel = document.getElementById('salad-select');
        const ChosenMain = document.getElementById('main-selected');
        const JuiceLabel = document.getElementById('juice-select');
        const ChosenJuice = document.getElementById('juice-selected');
        const DessertLabel = document.getElementById('dessert-select');
        const ChosenDessert = document.getElementById('dessert-selected');

        const EmptyMessage = document.getElementById('empty_space');

        ChosenSoup.style.display = 'none';
        ChosenMain.style.display = 'none';
        ChosenSalad.style.display = 'none';
        ChosenJuice.style.display = 'none';
        ChosenDessert.style.display = 'none';

        SoupLabel.style.display = 'none';
        MainLabel.style.display = 'none';
        SaladLabel.style.display = 'none';
        JuiceLabel.style.display = 'none';
        DessertLabel.style.display = 'none';

        FoodPriceElements.style.display = 'none';
        PriceCount.style.display = 'none';



        function GetOrder(dish) {
            let GetUpdate = false;

            if (dish['category'] === 'soup') {
                UpdateGridElem('soup', dish, ChosenSoup, SoupLabel);
                GetUpdate = true;
            } else if (dish['category'] === 'main-course') {
                UpdateGridElem('main-course', dish, ChosenMain, MainLabel);
                GetUpdate = true;
            } else if (dish['category'] === 'salad') {
                UpdateGridElem('salad', dish, ChosenSalad, SaladLabel);
                GetUpdate = true;
            } else if (dish['category'] === 'drink') {
                UpdateGridElem('drink', dish, ChosenJuice, JuiceLabel);
                GetUpdate = true;
            } else if (dish['category'] === 'dessert') {
                UpdateGridElem('dessert', dish, ChosenDessert, DessertLabel);
                GetUpdate = true;
            }

            if (GetUpdate === true) {
                EmptyMessage.style.display = 'none';
            }

            FoodPriceElements.textContent = 'Стоимость заказа';
            FoodPriceElements.style.display = 'block';
            PriceCount.textContent = `${FoodPrice}₽`;
            PriceCount.style.display = 'block';

            EmptyElements();

        }

        function UpdateGridElem(category, dish, CurrentElem, LabelElem) {
            if (ChosenFood[category] !== null) {
                FoodPrice -= ChosenFood[category]['price'];
            }

            ChosenFood[category] = dish;
            CurrentElem.textContent = `${dish['name']} ${dish['price']}₽`;
            CurrentElem.style.display = 'block';
            LabelElem.style.display = 'block';

            FoodPrice += dish['price'];

            document.querySelector('form').addEventListener('reset', function () {
                ChosenSoup.style.display = 'none';
                ChosenMain.style.display = 'none';
                ChosenSalad.style.display = 'none';
                ChosenJuice.style.display = 'none';
                ChosenDessert.style.display = 'none';

                SoupLabel.style.display = 'none';
                MainLabel.style.display = 'none';
                SaladLabel.style.display = 'none';
                JuiceLabel.style.display = 'none';
                DessertLabel.style.display = 'none';
                PriceCount.style.display = 'none';
                FoodPriceElements.style.display = 'none';

                EmptyMessage.style.display = '';

                ChosenFood = {
                    'суп': null,
                    'главное блюдо': null,
                    'салат': null,
                    'напиток': null,
                    'десерт': null
                };

                FoodPrice = 0;
            })

        }

        function EmptyElements() {
            if (ChosenFood['soup'] === null) {
                ChosenSoup.textContent = 'Блюдо не выбрано';
                SoupLabel.style.display = 'block';
                ChosenSoup.style.display = 'block';
            }
            if (ChosenFood['main-course'] === null) {
                ChosenMain.textContent = 'Блюдо не выбрано';
                MainLabel.style.display = 'block';
                ChosenMain.style.display = 'block';
            }
            if (ChosenFood['salad'] === null) {
                ChosenSalad.textContent = 'Блюдо не выбрано';
                SaladLabel.style.display = 'block';
                ChosenSalad.style.display = 'block';
            }
            if (ChosenFood['drink'] === null) {
                ChosenJuice.textContent = 'drink не выбран';
                JuiceLabel.style.display = 'block';
                ChosenJuice.style.display = 'block';
            }
            if (ChosenFood['dessert'] === null) {
                ChosenDessert.textContent = 'dessert не выбран';
                DessertLabel.style.display = 'block';
                ChosenDessert.style.display = 'block';
            }
        }

        function setupFilters(category) {
            const filters = document.querySelectorAll(`.${category}-filter`);

            filters.forEach(filter => {
                filter.addEventListener('click', (e) => {
                    e.preventDefault();

                    const section = document.querySelector(`#${category} .grid`);
                    const dishes = section.querySelectorAll('.flex');
                    const isActive = filter.classList.contains('active');
                    const filterKind = filter.dataset.kind;


                    filters.forEach(f => f.classList.remove('active'));

                    if (!isActive) {
                        filter.classList.add('active');
                        dishes.forEach(dish => {
                            dish.classList.toggle('hidden', dish.dataset.kind !== filterKind);
                        });
                    } else {
                        dishes.forEach(dish => dish.classList.remove('hidden'));
                    }
                });
            });
        }

        const categories = ['soup', 'main', 'juice', 'salad', 'dessert'];
        categories.forEach(category => setupFilters(category));


        const submitButton = document.getElementById('submit'); //кнопка отправки формы
        const notification = document.getElementById('notification'); //уведомление
        const notificationText = document.getElementById('notification-text');//текст уведомления
        const notificationButton = document.getElementById('notification-button');//кнопка уведомления

        const comboOptions = [
            ['soup', 'main-course', 'salad', 'drink'],
            ['soup', 'main-course', 'drink'],
            ['soup', 'salad', 'drink'],
            ['main-course', 'salad', 'drink'],
            ['main-course', 'drink']
        ];

        function checkOrder() {
            const chosenCategories = Object.keys(ChosenFood).filter(category => ChosenFood[category]);//фильтрует категории, чтобы найти выбранные
            if (chosenCategories.length === 0) {
                showNotification("Ничего не выбрано. Выберите блюда для заказа");
                return false;
            } //если нет выбранных категорий

            let validCombo = comboOptions.some(option =>
                option.every(item => chosenCategories.includes(item))
            ); //проверка комбинаций комбо

            if (!validCombo) {
                if (!chosenCategories.includes('drink')) {
                    showNotification("Выберите напиток");
                } else if ((!chosenCategories.includes('main-course') || !chosenCategories.includes('salad')) && chosenCategories.includes('soup')) {
                    showNotification("Выберите главное блюдо/салат/стартер");
                } else if (!chosenCategories.includes('soup') && !chosenCategories.includes('main-course') && chosenCategories.includes('salad')) {
                    showNotification("Выберите суп или главное блюдо");
                } else if ((chosenCategories.includes('dessert')) || (chosenCategories.includes('drink'))) {
                    showNotification("Выберите главное блюдо");
                } else {
                    showNotification("Некорректный выбор. Проверьте ваш заказ.");
                }
                return false;
            } //для показа уведомлений

            return true; //Проверка успешная
        }

        function showNotification(message) {
            notificationText.textContent = message;
            notification.classList.remove('hidden');
        } //убираем скрытие

        notificationButton.addEventListener('click', () => {
            notification.classList.add('hidden');
        });

        submitButton.addEventListener('click', (event) => {
            if (!checkOrder()) {
                event.preventDefault(); // Не отправляем форму, если заказ некорректен
            }
        });
    } catch (error) {
        console.error("Ошибка при загрузке блюд:", error);
    }
}




