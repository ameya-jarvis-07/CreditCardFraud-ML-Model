"""
Credit Card Fraud Detection - Flask Web Application
====================================================
Author: Senior ML Engineer
Description: Production-ready Flask app that serves the trained fraud
             detection model via a modern web interface.
"""

import os
import logging
import numpy as np
import joblib
from flask import Flask, request, jsonify, render_template

# ---------------------------------------------------------------------------
# Logging Configuration
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  [%(levelname)s]  %(message)s",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Flask App Initialisation
# ---------------------------------------------------------------------------
app = Flask(__name__)

# ---------------------------------------------------------------------------
# Load Artifacts
# ---------------------------------------------------------------------------
MODEL_PATH = "best_fraud_detection_model.pkl"
PIPELINE_PATH = "preprocessing_pipeline.pkl"

model = None
preprocessing_pipeline = None


def load_artifacts() -> None:
    """Load the trained model and preprocessing pipeline from disk."""
    global model, preprocessing_pipeline

    if not os.path.exists(MODEL_PATH):
        logger.error("Model file '%s' not found. Run the notebook first.", MODEL_PATH)
        raise FileNotFoundError(
            f"Model file '{MODEL_PATH}' not found. "
            "Please run fraud_detection.ipynb to train and save the model."
        )

    if not os.path.exists(PIPELINE_PATH):
        logger.error(
            "Pipeline file '%s' not found. Run the notebook first.", PIPELINE_PATH
        )
        raise FileNotFoundError(
            f"Pipeline file '{PIPELINE_PATH}' not found. "
            "Please run fraud_detection.ipynb to save the preprocessing pipeline."
        )

    model = joblib.load(MODEL_PATH)
    preprocessing_pipeline = joblib.load(PIPELINE_PATH)
    logger.info("Model and preprocessing pipeline loaded successfully.")


# ---------------------------------------------------------------------------
# Feature Definitions
# ---------------------------------------------------------------------------
# 30 input features: Time, V1–V28, Amount
FEATURE_NAMES = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount"]


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.route("/", methods=["GET"])
def index():
    """Render the main prediction page."""
    return render_template("index.html", feature_names=FEATURE_NAMES)


@app.route("/predict", methods=["POST"])
def predict():
    """
    Accept JSON payload with 30 feature values, run preprocessing
    and model inference, and return the prediction result.

    Expected JSON body:
    {
        "Time": 0.0,
        "V1": -1.35, ..., "V28": -0.02,
        "Amount": 149.62
    }
    """
    try:
        data = request.get_json(force=True)

        if data is None:
            return jsonify({"error": "No JSON data received."}), 400

        # ------------------------------------------------------------------
        # Validate & Extract Features
        # ------------------------------------------------------------------
        missing = [f for f in FEATURE_NAMES if f not in data]
        if missing:
            return (
                jsonify({"error": f"Missing features: {missing}"}),
                400,
            )

        raw_values = np.array([[float(data[f]) for f in FEATURE_NAMES]])

        # ------------------------------------------------------------------
        # Preprocessing  (RobustScaler applied to Time & Amount only)
        # ------------------------------------------------------------------
        processed = preprocessing_pipeline.transform(raw_values)

        # ------------------------------------------------------------------
        # Prediction
        # ------------------------------------------------------------------
        prediction = int(model.predict(processed)[0])
        probability = float(model.predict_proba(processed)[0][1])

        result_label = "Fraud" if prediction == 1 else "Legitimate"
        confidence = probability if prediction == 1 else (1 - probability)

        logger.info(
            "Prediction: %s | Fraud Probability: %.4f", result_label, probability
        )

        return jsonify(
            {
                "prediction": prediction,
                "label": result_label,
                "fraud_probability": round(probability * 100, 2),
                "confidence": round(confidence * 100, 2),
            }
        )

    except ValueError as exc:
        logger.error("ValueError during prediction: %s", exc)
        return jsonify({"error": f"Invalid input value: {exc}"}), 422

    except Exception as exc:  # pylint: disable=broad-except
        logger.error("Unexpected error during prediction: %s", exc)
        return jsonify({"error": f"Prediction failed: {exc}"}), 500


@app.route("/health", methods=["GET"])
def health():
    """Health-check endpoint for monitoring / orchestration."""
    status = "ok" if (model is not None and preprocessing_pipeline is not None) else "degraded"
    return jsonify({"status": status, "model_loaded": model is not None})


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    load_artifacts()
    app.run(debug=True, host="0.0.0.0", port=5000)
