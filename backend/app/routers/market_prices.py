from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List
import random

router = APIRouter()


class PriceEntry(BaseModel):
    crop: str
    market: str
    price_per_100kg: float
    currency: str = "NGN"
    trend: str  # "up" | "down" | "flat"
    change_pct: float


class MarketPricesResponse(BaseModel):
    prices: List[PriceEntry]
    market: str
    last_updated: str


MARKETS = ["Lagos", "Kano", "Onitsha", "Ibadan", "Port Harcourt"]

BASE_PRICES = {
    "Maize":   6500,
    "Cassava": 3700,
    "Yam":    15800,
    "Rice":   49500,
    "Tomatoes": 4900,
    "Cowpea":  8500,
    "Groundnut": 12000,
    "Sorghum": 5800,
}


def get_trend() -> tuple[str, float]:
    pct = round(random.uniform(-5.0, 8.0), 1)
    return ("up" if pct > 0 else "down" if pct < 0 else "flat"), pct


@router.get("/prices", response_model=MarketPricesResponse)
def get_market_prices(market: str = Query(default="Lagos", enum=MARKETS)):
    """
    Returns current commodity prices for a given Nigerian market.
    Replace with live data feed (e.g., AFEX, GrainPulse, or web-scraped data).
    """
    from datetime import datetime
    prices = []
    for crop, base in BASE_PRICES.items():
        # Simulate slight market variation per location
        variation = random.uniform(0.92, 1.10)
        price = round(base * variation, -2)  # round to nearest 100
        trend, pct = get_trend()
        prices.append(PriceEntry(crop=crop, market=market, price_per_100kg=price, trend=trend, change_pct=pct))

    return MarketPricesResponse(
        prices=prices,
        market=market,
        last_updated=datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC"),
    )
