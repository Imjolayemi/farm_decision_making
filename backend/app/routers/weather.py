from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List

router = APIRouter()


class WeatherCondition(BaseModel):
    temperature_c: float
    humidity_pct: float
    wind_kmh: float
    rain_chance_pct: float
    description: str
    uv_index: int


class IrrigationAdvice(BaseModel):
    condition: str
    action: str
    urgent: bool


class WeatherResponse(BaseModel):
    zone: str
    current: WeatherCondition
    irrigation_advice: List[IrrigationAdvice]
    seven_day_summary: str


ZONE_DATA = {
    "Southern Guinea Savanna": WeatherCondition(
        temperature_c=32, humidity_pct=78, wind_kmh=14,
        rain_chance_pct=80, description="Heavy Rain expected",  uv_index=8,
    ),
    "Northern Guinea Savanna": WeatherCondition(
        temperature_c=37, humidity_pct=42, wind_kmh=22,
        rain_chance_pct=15, description="Dry and Sunny", uv_index=10,
    ),
    "Rain Forest Zone": WeatherCondition(
        temperature_c=28, humidity_pct=90, wind_kmh=8,
        rain_chance_pct=95, description="Heavy Rainfall", uv_index=5,
    ),
    "Derived Savanna": WeatherCondition(
        temperature_c=33, humidity_pct=65, wind_kmh=18,
        rain_chance_pct=45, description="Partly Cloudy", uv_index=9,
    ),
    "Mangrove/Swamp Zone": WeatherCondition(
        temperature_c=29, humidity_pct=95, wind_kmh=10,
        rain_chance_pct=85, description="High Humidity, Showers", uv_index=4,
    ),
}

ZONES = list(ZONE_DATA.keys())


def get_irrigation_advice(zone: str, condition: WeatherCondition) -> List[IrrigationAdvice]:
    advice = []
    if condition.rain_chance_pct >= 70:
        advice.append(IrrigationAdvice(
            condition=f"Rain expected ({condition.rain_chance_pct:.0f}% chance)",
            action="Skip irrigation today — save water and costs.",
            urgent=True,
        ))
    else:
        advice.append(IrrigationAdvice(
            condition="No significant rain expected",
            action="Irrigate crops in the early morning to minimise evaporation.",
            urgent=False,
        ))
    if condition.humidity_pct < 50:
        advice.append(IrrigationAdvice(
            condition="Low humidity detected",
            action="Increase irrigation frequency — crops may experience moisture stress.",
            urgent=True,
        ))
    advice.append(IrrigationAdvice(
        condition="General recommendation",
        action="Monitor soil moisture at 10 cm depth before each irrigation cycle.",
        urgent=False,
    ))
    return advice


@router.get("/", response_model=WeatherResponse)
def get_weather(zone: str = Query(default="Southern Guinea Savanna", enum=ZONES)):
    """
    Returns hyper-local weather and irrigation recommendations for a Nigerian growing zone.
    Replace with live OpenWeatherMap API integration.
    """
    condition = ZONE_DATA.get(zone, ZONE_DATA["Southern Guinea Savanna"])
    return WeatherResponse(
        zone=zone,
        current=condition,
        irrigation_advice=get_irrigation_advice(zone, condition),
        seven_day_summary="Rain expected first 2 days, clearing mid-week with sunny spells Thursday–Saturday.",
    )
