import sqlite3

# для создания веб-приложения, работы с запросами и обработки исключений HTTP
from fastapi import FastAPI, Request, HTTPException

# для возвращения HTML и JSON ответов
from fastapi.responses import HTMLResponse, JSONResponse

# для работы с HTML-шаблонами
from fastapi.templating import Jinja2Templates

# для работы со статическими файлами
from fastapi.staticfiles import StaticFiles

# для работы с ORM и подключением к базе данных
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import Request


# Создаем экземпляр приложения FastAPI
app = FastAPI()

# пути для файликов CSS, JavaScript, images
app.mount("/static", StaticFiles(directory="static"), name="static")

# для отображения HTML-шаблонов в приложении Fast API
templates = Jinja2Templates(directory="templates")

# подключение к бд
DATABASE_URL = "sqlite:///./database.db"

# cоздаем движок базы данных
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Настраиваем сессию для работы с базой данных
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# базовый класс для моделей SQLAlchemy
Base = declarative_base()


# маршрут для /index
@app.get("/index", response_class=HTMLResponse)
async def about(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


# маршрут для /bouquets
@app.get("/bouquets", response_class=HTMLResponse)
async def bouquets(request: Request):
    return templates.TemplateResponse("bouquets.html", {"request": request})


# маршрут для /gifts
@app.get("/gifts", response_class=HTMLResponse)
async def gifts(request: Request):
    return templates.TemplateResponse("gifts.html", {"request": request})


# маршрут для /contacts
@app.get("/contacts", response_class=HTMLResponse)
async def contacts(request: Request):
    return templates.TemplateResponse("contacts.html", {"request": request})


# маршрут /, который возвращает HTML-шаблон index.html
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


# маршрут, который возвращает список букетов из базы данных products.db в формате JSON
@app.get("/api/products")
async def get_products():
    conn = sqlite3.connect("products.db")
    conn.row_factory = sqlite3.Row
    products = conn.execute(
        "SELECT id, name, image, price, short_description FROM products"
    ).fetchall()
    conn.close()
    return JSONResponse(content=[dict(product) for product in products])


# маршрут, который возвращает список подарков из базы данных gifts.db в формате JSON
@app.get("/api/gifts")
async def get_gifts():
    conn = sqlite3.connect("gifts.db")
    conn.row_factory = sqlite3.Row
    gifts = conn.execute("SELECT id, name, image, price FROM gifts").fetchall()
    conn.close()
    return JSONResponse(content=[dict(gift) for gift in gifts])


# маршрут, который возвращает детали конкретного букета по его id
@app.get("/api/products/{product_id}")
async def get_product_details(product_id: int):
    conn = sqlite3.connect("products.db")
    conn.row_factory = sqlite3.Row
    product = conn.execute(
        "SELECT * FROM products WHERE id = ?", (product_id,)
    ).fetchone()
    conn.close()
    if product is None:
        # генерирует исключение
        raise HTTPException(status_code=404, detail="Product not found")
    return JSONResponse(content=dict(product))


# маршрут, который возвращает детали конкретного подарка по его id
@app.get("/api/gifts/{gift_id}")
async def get_gift_details(gift_id: int):  # Аргумент совпадает с {gift_id}
    conn = sqlite3.connect("gifts.db")
    conn.row_factory = sqlite3.Row
    gift = conn.execute("SELECT * FROM gifts WHERE id = ?", (gift_id,)).fetchone()
    conn.close()
    if gift is None:
        raise HTTPException(status_code=404, detail="Gift not found")
    return JSONResponse(content=dict(gift))


# маршрут, который возвращает HTML-шаблон с деталями букета
@app.get("/product-details/{product_id}", response_class=HTMLResponse)
async def product_details(request: Request, product_id: int):
    conn = sqlite3.connect("products.db")
    conn.row_factory = sqlite3.Row
    product = conn.execute(
        "SELECT * FROM products WHERE id = ?", (product_id,)
    ).fetchone()
    conn.close()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return templates.TemplateResponse(
        "product-details.html", {"request": request, "product": product}
    )


# маршрут, который возвращает HTML-шаблон с деталями подарка
@app.get("/gift-details/{gift_id}", response_class=HTMLResponse)
async def gifts_details(request: Request, gift_id: int):
    conn = sqlite3.connect("gifts.db")
    conn.row_factory = sqlite3.Row
    gift = conn.execute("SELECT * FROM gifts WHERE id = ?", (gift_id,)).fetchone()
    conn.close()

    if not gift:
        raise HTTPException(status_code=404, detail="Gift not found")

    return templates.TemplateResponse(
        "gifts-details.html", {"request": request, "gift": gift}
    )


# запускаем приложение с помощью uvicorn на локальном хосте 127.0.0.1 и порту 5500.
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=5500)
