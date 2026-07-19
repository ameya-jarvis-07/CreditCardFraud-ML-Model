/**
 * Credit Card Fraud Detection — script.js
 * ========================================
 * Client-side validation, sample data fill, loading animation,
 * API call, and animated result rendering.
 */

"use strict";

/* ============================================================
   Constants & Sample Data
   ============================================================ */

/**
 * A real legitimate transaction from the dataset (first row).
 */
const SAMPLE_LEGITIMATE = {
  Time: 0,
  V1: -1.3598071336738, V2: -0.0727811733098497, V3: 2.53634673796914,
  V4: 1.37815522427443,  V5: -0.338320769942518,  V6: 0.462387777762292,
  V7: 0.239598554061257, V8: 0.0986979012610507,  V9: 0.363786969611213,
  V10: 0.0907941719789316, V11: -0.55159953328236, V12: -0.617800855762348,
  V13: -0.991389847235408, V14: -0.311169353699879, V15: 1.46817697209427,
  V16: -0.470400525259478, V17: 0.207971241929242,  V18: 0.0257905801985591,
  V19: 0.403992960255733,  V20: 0.251412098239705,  V21: -0.018306777944153,
  V22: 0.277837575558899,  V23: -0.110473910188767,  V24: 0.0669280749146731,
  V25: 0.128539358273528,  V26: -0.189114843888824,  V27: 0.133558376740387,
  V28: -0.0210530534538215,
  Amount: 149.62,
};

/**
 * A known fraudulent transaction from the dataset.
 */
const SAMPLE_FRAUD = {
  Time: 406,
  V1: -2.3122265423263,  V2: 1.95199201064158,    V3: -1.60985073229769,
  V4: 3.9979055875468,   V5: -0.522187864667764,   V6: -1.42654531920595,
  V7: -2.53738730624579, V8: 1.39165724829804,     V9: -2.77008927719433,
  V10: -2.77227214465915, V11: 3.20203320709635,   V12: -2.89990738849473,
  V13: -0.595221881324605, V14: -4.28925378244217,  V15: 0.389724400526696,
  V16: -1.14074717980657, V17: -2.83005567450437,   V18: -0.0168224681808257,
  V19: 0.416955705037907, V20: 0.126910559061474,   V21: 0.517232370861764,
  V22: -0.0350493686052974, V23: -0.465211076358495, V24: 0.320198198514526,
  V25: 0.0445191674731724, V26: 0.177839798284401,  V27: 0.261145002567677,
  V28: -0.143275874698919,
  Amount: 0,
};

/** All 30 feature names in order */
const FEATURE_NAMES = [
  "Time",
  ...Array.from({ length: 28 }, (_, i) => `V${i + 1}`),
  "Amount",
];

/* ============================================================
   DOM References
   ============================================================ */
const form           = document.getElementById("predictionForm");
const predictBtn     = document.getElementById("predictBtn");
const fillSampleBtn  = document.getElementById("fillSampleBtn");
const fillFraudBtn   = document.getElementById("fillFraudBtn");
const resetBtn       = document.getElementById("resetBtn");
const resultSection  = document.getElementById("resultSection");
const errorToast     = document.getElementById("errorToast");
const errorMessage   = document.getElementById("errorMessage");
const closeToast     = document.getElementById("closeToast");

// Result elements
const resultIcon       = document.getElementById("resultIcon");
const resultTitle      = document.getElementById("resultTitle");
const resultSubtitle   = document.getElementById("resultSubtitle");
const resultBadge      = document.getElementById("resultBadge");
const gaugeFill        = document.getElementById("gaugeFill");
const gaugeThumb       = document.getElementById("gaugeThumb");
const fraudPct         = document.getElementById("fraudPct");
const metricPrediction = document.getElementById("metricPrediction");
const metricFraudProb  = document.getElementById("metricFraudProb");
const metricConfidence = document.getElementById("metricConfidence");
const metricRisk       = document.getElementById("metricRisk");

/* ============================================================
   Utility: Fill form with sample data
   ============================================================ */

/**
 * Fills every input field with values from the provided data object.
 * @param {Object} data - Key-value map of feature → value
 */
function fillForm(data) {
  FEATURE_NAMES.forEach((name) => {
    const el = document.getElementById(`input-${name}`);
    if (el) {
      el.value = data[name] ?? "";
      el.classList.remove("error");
    }
  });
}

/* ============================================================
   Validation
   ============================================================ */

/**
 * Validates all form inputs.
 * Marks empty or non-numeric fields with the 'error' CSS class.
 * @returns {{ valid: boolean, payload: Object }}
 */
function validateForm() {
  let valid = true;
  const payload = {};

  FEATURE_NAMES.forEach((name) => {
    const el = document.getElementById(`input-${name}`);
    if (!el) return;

    const raw = el.value.trim();
    const num = Number(raw);

    if (raw === "" || isNaN(num)) {
      el.classList.add("error");

      // Remove error class on next user interaction
      el.addEventListener("input", () => el.classList.remove("error"), { once: true });
      valid = false;
    } else {
      el.classList.remove("error");
      payload[name] = num;
    }
  });

  return { valid, payload };
}

/* ============================================================
   Risk Level Helper
   ============================================================ */

/**
 * Derives a human-readable risk level from the fraud probability.
 * @param {number} pct - Fraud probability percentage (0–100)
 * @returns {string}
 */
function getRiskLevel(pct) {
  if (pct < 20)  return "Very Low";
  if (pct < 40)  return "Low";
  if (pct < 60)  return "Moderate";
  if (pct < 80)  return "High";
  return "Critical";
}

/**
 * Derives a CSS color token for the risk level.
 * @param {number} pct
 * @returns {string}
 */
function getRiskColor(pct) {
  if (pct < 20)  return "var(--clr-success)";
  if (pct < 60)  return "var(--clr-warning)";
  return "var(--clr-danger)";
}

/* ============================================================
   Result Rendering
   ============================================================ */

/**
 * Animates a numeric counter from 0 to target over `duration` ms.
 * @param {HTMLElement} el
 * @param {number} target
 * @param {string} suffix
 * @param {number} duration
 */
function animateCounter(el, target, suffix = "%", duration = 900) {
  const start = performance.now();
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = `${(eased * target).toFixed(2)}${suffix}`;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/**
 * Renders the prediction result returned from the Flask API.
 * @param {{ prediction: number, label: string, fraud_probability: number, confidence: number }} data
 */
function renderResult(data) {
  const isFraud   = data.prediction === 1;
  const fraudProb = data.fraud_probability; // 0–100

  // --- Icons ---
  resultIcon.textContent = isFraud ? "⚠️" : "✅";
  resultIcon.className   = `result-icon ${isFraud ? "fraud" : "legit"}`;

  // --- Title & Subtitle ---
  resultTitle.textContent   = isFraud ? "⚠ Fraudulent Transaction Detected" : "✅ Legitimate Transaction";
  resultTitle.style.color   = isFraud ? "var(--clr-danger)" : "var(--clr-success)";
  resultSubtitle.textContent = isFraud
    ? "This transaction has been flagged as potentially fraudulent. Immediate review is recommended."
    : "This transaction appears legitimate based on the provided features.";

  // --- Badge ---
  resultBadge.textContent = isFraud ? "🔴 FRAUD" : "🟢 LEGITIMATE";
  resultBadge.className   = `result-badge ${isFraud ? "fraud" : "legit"}`;

  // --- Gauge Animation ---
  const pct = `${fraudProb}%`;
  setTimeout(() => {
    gaugeFill.style.width  = pct;
    gaugeThumb.style.left  = pct;
  }, 80);

  animateCounter(fraudPct, fraudProb, "%");

  // --- Metric Cards ---
  metricPrediction.textContent = data.label;
  metricPrediction.style.color = isFraud ? "var(--clr-danger)" : "var(--clr-success)";

  metricFraudProb.textContent  = `${fraudProb}%`;
  metricFraudProb.style.color  = getRiskColor(fraudProb);

  metricConfidence.textContent = `${data.confidence}%`;
  metricConfidence.style.color = "var(--clr-accent-alt)";

  const risk = getRiskLevel(fraudProb);
  metricRisk.textContent       = risk;
  metricRisk.style.color       = getRiskColor(fraudProb);

  // --- Show Result Section ---
  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

/* ============================================================
   Error Toast
   ============================================================ */

/**
 * Displays the error toast with the provided message.
 * @param {string} msg
 */
function showError(msg) {
  errorMessage.textContent = msg;
  errorToast.hidden = false;
}

function hideError() {
  errorToast.hidden = true;
}

/* ============================================================
   Form Submit → API Call
   ============================================================ */

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideError();

  const { valid, payload } = validateForm();

  if (!valid) {
    showError("Please fill in all 30 feature fields with valid numbers before predicting.");
    // Scroll to first error
    const firstError = form.querySelector(".input-field.error");
    if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  // Show loading state
  predictBtn.classList.add("loading");
  predictBtn.disabled = true;
  resultSection.hidden = true;

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`);
    }

    renderResult(data);
  } catch (err) {
    showError(`Prediction failed: ${err.message}. Ensure the model is loaded and the server is running.`);
    console.error("[FraudShield] Prediction error:", err);
  } finally {
    predictBtn.classList.remove("loading");
    predictBtn.disabled = false;
  }
});

/* ============================================================
   Sample Fill Buttons
   ============================================================ */

fillSampleBtn.addEventListener("click", () => {
  fillForm(SAMPLE_LEGITIMATE);
  resultSection.hidden = true;
  hideError();
});

fillFraudBtn.addEventListener("click", () => {
  fillForm(SAMPLE_FRAUD);
  resultSection.hidden = true;
  hideError();
});

/* ============================================================
   Reset Button
   ============================================================ */

resetBtn.addEventListener("click", () => {
  form.reset();
  document.querySelectorAll(".input-field").forEach((el) => el.classList.remove("error"));
  resultSection.hidden = true;
  hideError();
  // Reset gauge
  gaugeFill.style.width  = "0%";
  gaugeThumb.style.left  = "0%";
  fraudPct.textContent   = "0%";
});

/* ============================================================
   Toast Close
   ============================================================ */

closeToast.addEventListener("click", hideError);

/* ============================================================
   Remove error class on input
   ============================================================ */

document.querySelectorAll(".input-field").forEach((el) => {
  el.addEventListener("input", () => el.classList.remove("error"));
});
