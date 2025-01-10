document.addEventListener('DOMContentLoaded', () => {
    fetch("https://edu.std-900.ist.mospolytech.ru/labs/api/dishes")
        .then(response => response.json())
        .then(data => {
            const sortedFood = data.sort((a, b) => {
                return a['name'].localeCompare(b['name'], 'ru');
            });

            const SectionSoups = document.querySelectorAll('.grid')[0];
            const SectionMain = document.querySelectorAll('.grid')[1];
            const SectionSalad = document.querySelectorAll('.grid')[2];
            const Sectiondrink = document.querySelectorAll('.grid')[3];
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
            GoTickets(Sectiondrink, 'drink');
            GoTickets(SectionDessert, 'dessert');

            let FoodPrice = 0;
            const FoodPriceElements = document.getElementById('price');

            let ChosenFood = {
                'soup': null,
                'main-course': null,
                'salad': null,
                'drink': null,
                'dessert': null,
            };

            const comboOptions = [
                ['soup', 'main-course', 'salad', 'drink'],
                ['soup', 'main-course', 'drink'],
                ['soup', 'salad', 'drink'],
                ['main-course', 'salad', 'drink'],
                ['main-course', 'drink']
            ];

            function checkOrder() {
                let notification = '';
                let chosenCategories = Object.keys(ChosenFood).filter(category =>
                    ChosenFood[category] && category !== 'dessert' // Исключаем десерты
                );

                if (chosenCategories.length === 0) {
                    notification = "Ничего не выбрано. Выберите блюда для заказа";
                } //если нет выбранных категорий

                let validCombo = comboOptions.some(option =>
                    option.every(item => chosenCategories.includes(item))
                ); //проверка комбинаций комбо

                if (!validCombo) {
                    if (!chosenCategories.includes('drink')) {
                        notification = "Выберите напиток";
                    } else if ((!chosenCategories.includes('main-course') || !chosenCategories.includes('salad'))
                        && chosenCategories.includes('soup')) {
                        notification = "Выберите главное блюдо/салат/стартер";
                    } else if (!chosenCategories.includes('soup') && !chosenCategories.includes('main-course')
                        && chosenCategories.includes('salad')) {
                        notification = "Выберите суп или главное блюдо";
                    } else if ((chosenCategories.includes('dessert')) || (chosenCategories.includes('drink'))) {
                        notification = "Выберите главное блюдо";
                    } else {
                        notification = "Некорректный выбор. Проверьте ваш заказ.";
                    }
                }

                let check;

                comboOptions.forEach(function (combo) {
                    if (JSON.stringify(chosenCategories) === JSON.stringify(combo)) {
                        check = { valid: true, message: 'Блюда успешно выбраны' }
                    }
                });

                if (check) {
                    return check;
                }
                return { valid: false, message: notification };


            }

            const message = document.querySelector('.get_order');
            const link = document.querySelector('.order_link');
            link.style.display = 'none';
            message.style.display = 'none';


            function GetOrder(dish) {
                if (dish['category'] === 'soup') {
                    UpdateGridElem('soup', dish);
                    window.localStorage.setItem('soup-selected', dish['id']);
                } else if (dish['category'] === 'main-course') {
                    UpdateGridElem('main-course', dish);
                    window.localStorage.setItem('main-course-selected', dish['id']);
                } else if (dish['category'] === 'salad') {
                    UpdateGridElem('salad', dish);
                    window.localStorage.setItem('salad-selected', dish['id']);
                } else if (dish['category'] === 'drink') {
                    UpdateGridElem('drink', dish);
                    window.localStorage.setItem('drink-selected', dish['id']);
                } else if (dish['category'] === 'dessert') {
                    UpdateGridElem('dessert', dish);
                    window.localStorage.setItem('dessert-selected', dish['id']);
                }

                if (FoodPriceElements) {
                    FoodPriceElements.textContent = `Стоимость заказа ${FoodPrice}₽`;
                    FoodPriceElements.style.display = 'block';
                }

                message.style.display = '';

                const validate = checkOrder();
                //проверка
                if (validate.valid) {
                    link.style.display = ''; // Показать кнопку
                } else {
                    link.style.display = 'none'; // Скрыть кнопку
                }
            }

            function loadFromLocalStorage() {
                const localStorageIds = [
                    window.localStorage.getItem('soup-selected'),
                    window.localStorage.getItem('main-course-selected'),
                    window.localStorage.getItem('salad-selected'),
                    window.localStorage.getItem('drink-selected'),
                    window.localStorage.getItem('dessert-selected'),
                ]
                sortedFood.forEach(function (dish) {
                    if (localStorageIds.includes(String(dish['id']))) {
                        GetOrder(dish);
                    }
                });

            }

            loadFromLocalStorage();


            function UpdateGridElem(category, dish) {
                if (ChosenFood[category] !== null) {
                    FoodPrice -= ChosenFood[category]['price'];
                }

                ChosenFood[category] = dish;

                FoodPrice += dish['price'];


            }

            const categories = ['soup', 'main', 'drink', 'salad', 'dessert'];
            categories.forEach(category => setupFilters(category));

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

        });
});
