from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List
from PIL import Image
import io

router = APIRouter()


class DiseaseResult(BaseModel):
    disease: str
    confidence: float
    severity: str
    description: str
    treatment: List[str]
    prevention: str


MOCK_DISEASES = [
    DiseaseResult(
        disease="Cassava Mosaic Disease",
        confidence=91.0,
        severity="Moderate (Stage 2)",
        description="Viral disease transmitted by whiteflies. Causes yellow-green mosaic patterns on leaves and stunted growth.",
        treatment=[
            "Remove and destroy severely infected plants immediately.",
            "Apply insecticide (e.g., Imidacloprid) to control whitefly vectors.",
            "Use certified virus-free planting material for replanting.",
            "Apply potassium-rich fertilizer to support recovery.",
        ],
        prevention="Plant resistant varieties (TMS 30572, TMS 92B/0057). Use reflective mulch to deter whiteflies.",
    ),
    DiseaseResult(
        disease="Maize Fall Armyworm",
        confidence=87.5,
        severity="High (Active Infestation)",
        description="Spodoptera frugiperda larvae feed on maize whorl and leaves, causing ragged holes and frass deposits.",
        treatment=[
            "Apply Emamectin Benzoate or Chlorpyrifos to crop whorl.",
            "Scout fields at dawn or dusk when larvae are active.",
            "Remove and crush egg masses found on lower leaf surfaces.",
            "Consider biological control with Bacillus thuringiensis (Bt).",
        ],
        prevention="Early planting, intercropping with legumes, and monitoring pheromone traps.",
    ),
]


@router.post("/", response_model=DiseaseResult)
async def detect_disease(file: UploadFile = File(...)):
    """
    Accepts a crop leaf image and returns disease diagnosis.
    Currently returns mock data — replace with CNN model inference (TensorFlow/ONNX).
    """
    # Validate it's an image
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))
        img.verify()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file. Please upload a JPG or PNG.")

    # Placeholder: return first mock result (replace with model.predict())
    import random
    return random.choice(MOCK_DISEASES)
