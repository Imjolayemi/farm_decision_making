from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import crop_advisor, disease_detector, market_prices, weather, credit_score, ussd

app = FastAPI(
    title="FarmWise AI — Backend API",
    description="AI-powered agricultural decision support for Nigerian farmers.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://farmwise.ai"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crop_advisor.router,     prefix="/crop-advisor",   tags=["Crop Advisor"])
app.include_router(disease_detector.router, prefix="/disease-detect", tags=["Disease Detector"])
app.include_router(market_prices.router,    prefix="/market",         tags=["Market Prices"])
app.include_router(weather.router,          prefix="/weather",        tags=["Weather"])
app.include_router(credit_score.router,     prefix="/credit",         tags=["Credit Score"])
app.include_router(ussd.router,             prefix="/gateway",        tags=["USSD Gateway"])


@app.get("/", tags=["Health"])
def root():
    return {
        "status": "ok",
        "service": "FarmWise AI API",
        "version": "1.0.0",
        "endpoints": [
            "POST /crop-advisor/",
            "POST /disease-detect/",
            "GET  /market/prices",
            "GET  /weather/",
            "GET  /credit/{user_id}",
            "POST /gateway/ussd",
        ],
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
