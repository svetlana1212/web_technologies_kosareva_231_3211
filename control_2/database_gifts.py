import sqlite3


def create_database():
    conn = sqlite3.connect("gifts.db")
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS gifts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            image TEXT NOT NULL,
            price REAL NOT NULL,
            description TEXT NOT NULL,
            stock INTEGER NOT NULL
        )
    """
    )

    # Пример добавления данных
    cursor.executemany(
        """
        INSERT INTO gifts (name, image, price, description, stock)
        VALUES (?, ?, ?, ?, ?)
    """,
        [
            (
                "Бежевый мишка",
                "gifts/gift1.jpg",
                1499,
                "Плюшевый бежевый мишка с коричневым бантиком в клеточку, с улыбкой и добрыми глазами",
                5,
            ),
            (
                "Белый мишка",
                "gifts/gift2.jpg",
                1499,
                "Белый мишка с белым бантиком и надписью my first teddy",
                5,
            ),
            (
                "Серая кошка",
                "gifts/gift3.jpg",
                1299,
                "Серая кошка с хвостиком, мило наклоняет голову",
                5,
            ),
            (
                "Коричневый мишка",
                "gifts/gift4.jpg",
                1699,
                "Плюшевый мишка с коричневым бантиком и добрыми глазами",
                5,
            ),
            (
                "Коричневый мишка",
                "gifts/gift5.jpg",
                1899,
                "Коричневый мишка с белым бантиком и надписью my first teddy",
                5,
            ),
            (
                "Розовый мишка",
                "gifts/gift6.jpg",
                1799,
                "Розовый плюшевый мишка, сидит прямо, очень милый",
                5,
            ),
            (
                "Розовый зайка",
                "gifts/gift7.jpg",
                1999,
                "Розовый плюшевый зайка с добрыми глазами, сидит",
                5,
            ),
            (
                "Белый зайка",
                "gifts/gift8.jpg",
                1699,
                "Белый зайка с розовыми ушами и добрыми глазами",
                5,
            ),
            (
                "Белая овечка",
                "gifts/gift9.jpg",
                1699,
                "Белая плюшевая овечка с белым бантиком и милыми ушками",
                5,
            ),
            (
                "Белая кошка",
                "gifts/gift10.jpg",
                1599,
                "Белая кошка с усами, сидит и улыбается",
                5,
            ),
        ],
    )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    create_database()
