document.addEventListener('DOMContentLoaded', () => {
    fetch("foods.json").then(response => response.json()).then(data => {
        const sortedFood = data['dishes'].sort((a, b) => {
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
            weight.classList.add('weight');
            weight.textContent = dish['weight'];

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

        GoTickets(SectionSoups, 'суп');
        GoTickets(SectionMain, 'главное блюдо');
        GoTickets(SectionSalad, 'салат');
        GoTickets(SectionJuice, 'напиток');
        GoTickets(SectionDessert, 'десерт');

        let FoodPrice = 0;
        const FoodPriceElements = document.getElementById('food_price');
        const PriceCount = document.getElementById('price');

        let ChosenFood = {
            'суп': null,
            'главное блюдо': null,
            'салат': null,
            'напиток': null,
            'десерт': null,
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

            if (dish['category'] === 'суп') {
                UpdateGridElem('суп', dish, ChosenSoup, SoupLabel);
                GetUpdate = true;
            } else if (dish['category'] === 'главное блюдо') {
                UpdateGridElem('главное блюдо', dish, ChosenMain, MainLabel);
                GetUpdate = true;
            } else if (dish['category'] === 'салат') {
                UpdateGridElem('салат', dish, ChosenSalad, SaladLabel);
                GetUpdate = true;
            } else if (dish['category'] === 'напиток') {
                UpdateGridElem('напиток', dish, ChosenJuice, JuiceLabel);
                GetUpdate = true;
            } else if (dish['category'] === 'десерт') {
                UpdateGridElem('десерт', dish, ChosenDessert, DessertLabel);
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
        }

        function EmptyElements() {
            if (ChosenFood['суп'] === null) {
                ChosenSoup.textContent = 'Блюдо не выбрано';
                SoupLabel.style.display = 'block';
                ChosenSoup.style.display = 'block';
            }
            if (ChosenFood['главное блюдо'] === null) {
                ChosenMain.textContent = 'Блюдо не выбрано';
                MainLabel.style.display = 'block';
                ChosenMain.style.display = 'block';
            }
            if (ChosenFood['салат'] === null) {
                ChosenSalad.textContent = 'Блюдо не выбрано';
                SaladLabel.style.display = 'block';
                ChosenSalad.style.display = 'block';
            }
            if (ChosenFood['напиток'] === null) {
                ChosenJuice.textContent = 'Напиток не выбран';
                JuiceLabel.style.display = 'block';
                ChosenJuice.style.display = 'block';
            }
            if (ChosenFood['десерт'] === null) {
                ChosenDessert.textContent = 'Десерт не выбран';
                DessertLabel.style.display = 'block';
                ChosenDessert.style.display = 'block';
            }
        }



    });
});
