# USSD Bridge Architecture for FarmWise AI
# Access code: *347*123#  (register with your Nigerian telco partner)

# ── Flow Design ───────────────────────────────────────────────────────────────
#
# LEVEL 0 — Entry
#   Dial *347*123#
#   > Welcome to FarmWise AI
#   1. Crop Advisor
#   2. Market Prices
#   3. Weather & Irrigation
#   4. My Credit Score
#   5. Account Balance / Scans
#
# LEVEL 1A — Crop Advisor
#   > Select Soil Type:
#   1. Sandy   2. Clay   3. Loamy   4. Silty
#
# LEVEL 1B — Market Prices
#   > Select Market:
#   1. Lagos   2. Kano   3. Onitsha   4. Ibadan   5. PHC
#
#   > Select Crop:
#   1. Maize   2. Cassava   3. Yam   4. Rice   5. Tomatoes
#   → RESPONSE: "Maize in Lagos: N6,800/100kg (+4.6%)"
#
# LEVEL 1C — Weather
#   > Select zone or nearest state for weather summary
#
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import APIRouter, Request
from fastapi.responses import PlainTextResponse

router = APIRouter()

# In-memory session store (replace with Redis in production)
sessions: dict[str, dict] = {}

MENU_MAIN = (
    "CON Welcome to FarmWise AI\n"
    "1. Crop Advisor\n"
    "2. Market Prices\n"
    "3. Weather & Rain\n"
    "4. My Credit Score\n"
    "5. My Account"
)

SOIL_MENU = (
    "CON Select Soil Type:\n"
    "1. Sandy\n2. Clay\n3. Loamy\n4. Silty"
)

MARKET_MENU = (
    "CON Select Market:\n"
    "1. Lagos\n2. Kano\n3. Onitsha\n4. Ibadan\n5. Port Harcourt"
)

CROP_MENU = (
    "CON Select Crop:\n"
    "1. Maize\n2. Cassava\n3. Yam\n4. Rice\n5. Tomatoes"
)

SOIL_MAP   = {'1': 'Sandy', '2': 'Clay', '3': 'Loamy', '4': 'Silty'}
MARKET_MAP = {'1': 'Lagos', '2': 'Kano', '3': 'Onitsha', '4': 'Ibadan', '5': 'Port Harcourt'}
CROP_MAP   = {'1': 'Maize', '2': 'Cassava', '3': 'Yam', '4': 'Rice', '5': 'Tomatoes'}

# Mock prices (replace with real-time DB lookup)
PRICES = {
    'Maize': 6800, 'Cassava': 3700, 'Yam': 15800, 'Rice': 49500, 'Tomatoes': 4900,
}

CROP_RECS = {
    'Sandy': 'Groundnut, Sorghum, Melon',
    'Clay':  'Rice, Yam, Cocoyam',
    'Loamy': 'Maize, Cowpea, Cassava',
    'Silty': 'Cassava, Cotton, Sorghum',
}


@router.post("/ussd", response_class=PlainTextResponse)
async def ussd_handler(request: Request):
    """
    Handles Africa's Talking / Telco USSD gateway callbacks.
    Register this endpoint URL with your USSD provider.
    """
    form = await request.form()
    session_id  = form.get('sessionId', '')
    phone       = form.get('phoneNumber', '')
    text        = form.get('text', '').strip()

    steps = text.split('*') if text else []
    depth = len(steps)

    # ── Root menu ─────────────────────────────────────────────────────────────
    if text == '':
        return MENU_MAIN

    # ── Crop Advisor branch ───────────────────────────────────────────────────
    if steps[0] == '1':
        if depth == 1:
            return SOIL_MENU
        soil = SOIL_MAP.get(steps[1])
        if not soil:
            return "END Invalid option. Please try again."
        recs = CROP_RECS.get(soil, 'Cassava, Cowpea')
        return f"END FarmWise AI Crop Advice\nSoil: {soil}\nBest Crops:\n{recs}\n\nFor more details visit farmwise.ai"

    # ── Market Prices branch ──────────────────────────────────────────────────
    if steps[0] == '2':
        if depth == 1:
            return MARKET_MENU
        if depth == 2:
            return CROP_MENU
        market = MARKET_MAP.get(steps[1], 'Lagos')
        crop   = CROP_MAP.get(steps[2], 'Maize')
        price  = PRICES.get(crop, 5000)
        return f"END FarmWise Market Price\n{crop} in {market}:\nN{price:,}/100kg bag\n\nPrices updated daily.\nVisit farmwise.ai"

    # ── Weather branch ────────────────────────────────────────────────────────
    if steps[0] == '3':
        return "END Today's Weather:\nTemp: 32C | Humidity: 78%\nRain chance: 80%\n\nIrrigation advice:\nSkip irrigation - rain expected today.\nfarmwise.ai"

    # ── Credit Score branch ───────────────────────────────────────────────────
    if steps[0] == '4':
        return f"END FarmWise Credit Score\nPhone: {phone}\nScore: 720 (Good)\nLoan eligible: Yes\nMax loan: N500,000\n\nUpgrade plan at farmwise.ai"

    # ── Account branch ────────────────────────────────────────────────────────
    if steps[0] == '5':
        return "END FarmWise Account\nPlan: Free Farmer\nScans left: 1/3\nMarket alerts: 2\n\nUpgrade at farmwise.ai or dial *347*123*99#"

    return "END Invalid option. Dial *347*123# to try again."
