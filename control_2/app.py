import sqlite3
from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import Request


# FastAPI app setup
app = FastAPI()

# For static files (e.g., CSS, JavaScript, images)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Jinja2 templates setup
templates = Jinja2Templates(directory="templates")

# Database setup
DATABASE_URL = "sqlite:///./database.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


@app.get("/index", response_class=HTMLResponse)
async def about(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/bouquets", response_class=HTMLResponse)
async def bouquets(request: Request):
    return templates.TemplateResponse("bouquets.html", {"request": request})


@app.get("/gifts", response_class=HTMLResponse)
async def gifts(request: Request):
    return templates.TemplateResponse("gifts.html", {"request": request})


@app.get("/contacts", response_class=HTMLResponse)
async def contacts(request: Request):
    return templates.TemplateResponse("contacts.html", {"request": request})


# Routes
@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/api/products")
async def get_products():
    conn = sqlite3.connect("products.db")
    conn.row_factory = sqlite3.Row
    products = conn.execute(
        "SELECT id, name, image, price, short_description FROM products"
    ).fetchall()
    conn.close()
    return JSONResponse(content=[dict(product) for product in products])


@app.get("/api/gifts")
async def get_gifts():
    conn = sqlite3.connect("gifts.db")
    conn.row_factory = sqlite3.Row
    gifts = conn.execute("SELECT id, name, image, price FROM gifts").fetchall()
    conn.close()
    return JSONResponse(content=[dict(gift) for gift in gifts])


@app.get("/api/products/{product_id}")
async def get_product_details(product_id: int):
    conn = sqlite3.connect("products.db")
    conn.row_factory = sqlite3.Row
    product = conn.execute(
        "SELECT * FROM products WHERE id = ?", (product_id,)
    ).fetchone()
    conn.close()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return JSONResponse(content=dict(product))


@app.get("/api/gifts/{gift_id}")
async def get_gift_details(gift_id: int):  # Аргумент совпадает с {gift_id}
    conn = sqlite3.connect("gifts.db")
    conn.row_factory = sqlite3.Row
    gift = conn.execute("SELECT * FROM gifts WHERE id = ?", (gift_id,)).fetchone()
    conn.close()
    if gift is None:
        raise HTTPException(status_code=404, detail="Gift not found")
    return JSONResponse(content=dict(gift))


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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=5500)
