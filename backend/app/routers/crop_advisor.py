from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Optional
import random

router = APIRouter()


class CropAdvisorRequest(BaseModel):
    soil_type: str = Field(..., example="Loamy")
    soil_ph: float = Field(..., ge=4.0, le=9.0, example=6.5)
    nitrogen: Optional[float] = Field(None, ge=0, example=80)
    phosphorus: Optional[float] = Field(None, ge=0, example=40)
    potassium: Optional[float] = Field(None, ge=0, example=60)
    state: str = Field(..., example="Ogun")
    season: str = Field(..., example="Wet Season (Apr–Oct)")


class CropRecommendation(BaseModel):
    crop: str
    confidence: float
    reason: str
    season: str
    yield_range: str
    icon: str


class CropAdvisorResponse(BaseModel):
    recommendations: List[CropRecommendation]
    model_version: str = "decision_tree_v1"


# Rule-based mock (replace with trained model inference)
CROP_RULES = {
    "Loamy": [
        CropRecommendation(crop="Maize", confidence=94, icon="🌽",
            reason="Loamy soil with moderate pH is ideal for maize. High demand across Nigeria.",
            season="Both seasons", yield_range="3.2–4.5 t/ha"),
        CropRecommendation(crop="Cowpea", confidence=88, icon="🫘",
            reason="Excellent nitrogen fixer. Drought tolerant, great for dry season.",
            season="Dry season", yield_range="1.5–2.0 t/ha"),
        CropRecommendation(crop="Cassava", confidence=82, icon="🌿",
            reason="Highly adaptable to loamy soils. Consistent demand in Nigeria.",
            season="Wet season", yield_range="20–35 t/ha"),
    ],
    "Sandy": [
        CropRecommendation(crop="Groundnut", confidence=91, icon="🥜",
            reason="Sandy soils are perfect for groundnuts — good drainage prevents root rot.",
            season="Wet season", yield_range="1.2–1.8 t/ha"),
        CropRecommendation(crop="Melon (Egusi)", confidence=85, icon="🍈",
            reason="Thrives in well-drained sandy soils with warm conditions.",
            season="Both seasons", yield_range="0.8–1.5 t/ha"),
        CropRecommendation(crop="Sorghum", confidence=78, icon="🌾",
            reason="Drought-tolerant and well-suited to sandy, low-moisture soil.",
            season="Dry season", yield_range="2.0–3.5 t/ha"),
    ],
    "Clay": [
        CropRecommendation(crop="Rice (Lowland)", confidence=90, icon="🌾",
            reason="Clay soils retain water — ideal for lowland rice cultivation.",
            season="Wet season", yield_range="4.0–6.0 t/ha"),
        CropRecommendation(crop="Yam", confidence=80, icon="🍠",
            reason="Clay with organic matter supports yam tuber development.",
            season="Wet season", yield_range="15–25 t/ha"),
        CropRecommendation(crop="Cocoyam", confidence=75, icon="🌱",
            reason="Adapted to clay-heavy, moist soils in southern Nigeria.",
            season="Both seasons", yield_range="8–12 t/ha"),
    ],
}

DEFAULT_RECS = [
    CropRecommendation(crop="Cassava", confidence=80, icon="🌿",
        reason="Highly adaptable across most Nigerian soil types and climates.",
        season="Wet season", yield_range="20–35 t/ha"),
    CropRecommendation(crop="Cowpea", confidence=75, icon="🫘",
        reason="Drought-tolerant and nitrogen-fixing. Good for most zones.",
        season="Dry season", yield_range="1.5–2.0 t/ha"),
]


@router.post("/", response_model=CropAdvisorResponse)
def get_crop_recommendations(req: CropAdvisorRequest):
    """
    Returns AI crop recommendations based on soil and location parameters.
    Currently uses rule-based logic — replace with trained scikit-learn model.
    """
    recs = CROP_RULES.get(req.soil_type, DEFAULT_RECS)

    # Adjust confidence slightly by pH fitness
    adjusted = []
    for r in recs:
        conf_adj = r.confidence
        if req.soil_ph < 5.5 or req.soil_ph > 7.5:
            conf_adj = max(conf_adj - 8, 50)
        adjusted.append(r.model_copy(update={"confidence": round(conf_adj, 1)}))

    return CropAdvisorResponse(recommendations=adjusted)
