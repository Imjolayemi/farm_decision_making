from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()


class CreditScoreBreakdown(BaseModel):
    label: str
    score: float
    color: str


class CreditScoreResponse(BaseModel):
    user_id: str
    total_score: float
    grade: str
    max_loan_ngn: float
    breakdown: List[CreditScoreBreakdown]
    eligible: bool
    message: str


def compute_credit_score(user_id: str) -> CreditScoreResponse:
    """
    Computes a farm-health credit score based on platform engagement.
    Production version should pull from Firestore:
      - scan_count, crops_advised, market_views, login_streak, scan_accuracy
    This is a mock that returns deterministic scores based on user_id hash.
    """
    seed = sum(ord(c) for c in user_id) % 100
    scores = {
        'Farm Activity':   min(100, 60 + seed * 0.3),
        'Scan Usage':      min(100, 55 + seed * 0.4),
        'Market Engage.':  min(100, 50 + seed * 0.25),
        'Loan History':    min(100, 70 + seed * 0.2),
    }
    total = round(sum(scores.values()) / len(scores), 1)

    colors = {
        'Farm Activity':   '#22a05e',
        'Scan Usage':      '#2dd4bf',
        'Market Engage.':  '#f5a623',
        'Loan History':    '#22a05e',
    }
    grade   = 'Excellent' if total >= 80 else 'Good' if total >= 65 else 'Fair' if total >= 50 else 'Poor'
    max_loan = 0
    if total >= 80: max_loan = 1_000_000
    elif total >= 65: max_loan = 500_000
    elif total >= 50: max_loan = 200_000
    eligible = total >= 50

    return CreditScoreResponse(
        user_id=user_id,
        total_score=total,
        grade=grade,
        max_loan_ngn=max_loan,
        eligible=eligible,
        message=(
            f"Eligible for up to ₦{max_loan:,.0f} agri-loan." if eligible
            else "Improve your farm engagement score to qualify for loans."
        ),
        breakdown=[
            CreditScoreBreakdown(label=k, score=round(v, 1), color=colors[k])
            for k, v in scores.items()
        ],
    )


@router.get("/{user_id}", response_model=CreditScoreResponse)
def get_credit_score(user_id: str):
    """
    Returns farm health credit score and loan eligibility for a user.
    """
    if not user_id or len(user_id) < 3:
        raise HTTPException(status_code=400, detail="Invalid user ID.")
    return compute_credit_score(user_id)
