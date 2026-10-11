"""
Agent 3: Gap Predictor Agent (Objective 2)
Predicts future learning gaps using diagnostic scores and concept prerequisite DAGs.

Rule:
if prerequisite_score < 60:
    risk = "high"
elif prerequisite_score < 75:
    risk = "medium"
else:
    risk = "low"
"""

import os
import requests
from typing import List
from ..models.student import Student
from ..models.lesson import GapPrediction

class GapPredictorAgent:
    @classmethod
    def predict_classroom_gaps(cls, students: List[Student]) -> List[GapPrediction]:
        # 1. Query Vercel internal service binding if configured
        server_url = os.getenv("SERVER_URL")
        if server_url:
            try:
                remote_predictions = []
                for student in students:
                    dkt_payload = {
                        "student_id": student.id,
                        "student_name": student.name,
                        "preferred_language": student.preferences.preferred_language if student.preferences else "Hindi",
                        "history": [
                            {
                                "concept_id": m.topic_id,
                                "concept_name": m.topic_name,
                                "is_correct": 1 if (m.recent_quiz_score / max(1, m.max_quiz_score)) >= 0.6 else 0,
                                "timestamp": m.last_assessed
                            }
                            for m in student.topic_mastery
                        ]
                    }
                    resp = requests.post(f"{server_url.rstrip('/')}/api/dkt/predict", json=dkt_payload, timeout=3)
                    if resp.status_code == 200:
                        dkt_res = resp.json()
                        risk = dkt_res.get("risk_level", "medium")
                        projected_risk = float(dkt_res.get("projected_risk_score", 45.0))
                        gaps = dkt_res.get("predicted_gaps", ["Prerequisite Mastery"])
                        remote_predictions.append(GapPrediction(
                            student_id=student.id,
                            student_name=student.name,
                            weak_concept=dkt_res.get("suggested_focus_concept", "Chemical Equation & Stomatal Mechanics"),
                            prerequisite_score=round(max(10.0, 100.0 - projected_risk), 1),
                            risk_level=risk,
                            proactive_reason=f"DKT PyTorch LSTM Projected Risk: {projected_risk}%. Latent Gaps: {', '.join(gaps)}.",
                            suggested_scaffold=dkt_res.get("recommended_scaffolding", "Scaffolded bilingual intervention.")
                        ))
                if remote_predictions:
                    return remote_predictions
            except Exception:
                pass  # Fallback to local rule logic

        # 2. Local Rule-Based Logic Fallback
        predictions = []

        for student in students:
            # Find prerequisite scores (e.g. Plant Cell Structure, Fraction basics)
            scores = [m.recent_quiz_score / m.max_quiz_score * 100.0 for m in student.topic_mastery if m.max_quiz_score > 0]
            avg_prereq = float(sum(scores) / len(scores)) if scores else 50.0

            # Apply exact rule logic
            if avg_prereq < 60:
                risk = "high"
                proactive_reason = f"Prerequisite mastery ({round(avg_prereq, 1)}%) is under 60%. Highly likely to fail abstract chemical balancing."
                scaffold = "Inject 'Plant Kitchen' bilingual visual scaffold with step-by-step 2-minute checkpoint questions."
            elif avg_prereq < 75:
                risk = "medium"
                proactive_reason = f"Prerequisite mastery ({round(avg_prereq, 1)}%) is under 75%. May confuse stomatal gas exchange."
                scaffold = "Provide paired worksheet comparison of CO2 vs O2 movement."
            else:
                risk = "low"
                proactive_reason = f"Solid prerequisite mastery ({round(avg_prereq, 1)}%). Ready for advanced extension inquiry."
                scaffold = "Assign Calvin Cycle and variable light spectrum experiment."

            predictions.append(GapPrediction(
                student_id=student.id,
                student_name=student.name,
                weak_concept="Chemical Equation & Stomatal Mechanics" if risk == "high" else "Stomata Gas Exchange",
                prerequisite_score=round(avg_prereq, 1),
                risk_level=risk,
                proactive_reason=proactive_reason,
                suggested_scaffold=scaffold
            ))

        return predictions
