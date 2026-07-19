# Credit Card Fraud Detection 🛡️

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.3.0+-orange?style=for-the-badge&logo=scikit-learn)
![Flask](https://img.shields.io/badge/Flask-3.0.0+-black?style=for-the-badge&logo=flask)
![XGBoost](https://img.shields.io/badge/XGBoost-2.0.0+-green?style=for-the-badge)
![SMOTE](https://img.shields.io/badge/SMOTE-Imbalanced--Learn-red?style=for-the-badge)

---

## 📋 Project Description

This is a **production-ready, end-to-end Machine Learning project** for detecting fraudulent credit card transactions. The project covers the complete ML lifecycle — from Exploratory Data Analysis (EDA) and data preprocessing to model training, hyperparameter tuning, and deployment via a modern Flask web application.

The dataset contains transactions made by European cardholders in September 2013. It presents transactions that occurred over two days, with **492 frauds out of 284,807 transactions** — making it highly imbalanced (0.172% fraud rate). This project demonstrates best practices for handling class imbalance using **SMOTE**, feature scaling with **RobustScaler**, and model comparison to identify the optimal classifier.

---

## 📁 Project Structure

```
CreditCardFraud-ML-Model/
│
├── fraud_detection.ipynb          # Main Jupyter Notebook with EDA & Model Training
├── app.py                         # Flask Web Application (Production-ready)
├── requirements.txt               # Python Dependencies
├── README.md                      # Project Documentation
├── creditcard.csv                 # Dataset (Kaggle)
├── best_fraud_detection_model.pkl # Trained Best Model (XGBoost or Random Forest)
├── preprocessing_pipeline.pkl     # Preprocessing Pipeline (RobustScaler)
│
├── templates/
│   └── index.html                 # Frontend HTML Template (Glassmorphism UI)
│
├── static/
│   ├── css/
│   │   └── style.css              # Professional Styling & Animations
│   └── js/
│       └── script.js              # Client-side Validation & Interactive Animations
│
└── screenshots/
    ├── home.png                   # Landing Page
    ├── prediction.png             # Prediction Result View
    └── confusion_matrix.png       # Model Performance Visualization
```

---

## 📊 Dataset

| Property         | Value                                      |
|------------------|--------------------------------------------|
| **Source**       | [Kaggle - Credit Card Fraud Detection](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud) |
| **Total Rows**   | 284,807 transactions                       |
| **Features**     | 31 (Time, V1–V28, Amount, Class)           |
| **Fraudulent**   | 492 (0.172%)                               |
| **Legitimate**   | 284,315 (99.828%)                          |
| **Features**     | PCA-transformed components (V1–V28) + Time + Amount |
| **Target**       | Class (0 = Legitimate, 1 = Fraud)          |

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/ameya-jarvis-07/CreditCardFraud-ML-Model.git
cd CreditCardFraud-ML-Model
```

### 2. Create a Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Requirements
```bash
pip install -r requirements.txt
```

### 4. Download the Dataset
1. Visit [Kaggle - Credit Card Fraud Detection](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud)
2. Download `creditcard.csv`
3. Place it in the root directory of the project

---

## 🚀 How to Run

### Step 1: Train the Model (Run Jupyter Notebook)
```bash
jupyter notebook fraud_detection.ipynb
```
- Run all cells from top to bottom
- This will train and compare multiple models (Logistic Regression, Decision Tree, Random Forest, Gradient Boosting, XGBoost)
- Saves the best model and preprocessing pipeline:
  - `best_fraud_detection_model.pkl`
  - `preprocessing_pipeline.pkl`

### Step 2: Launch the Flask Web Application
```bash
python app.py
```
- The app will start on **http://127.0.0.1:5000**
- Open your browser and navigate to the URL
- Enter 30 feature values (Time, V1–V28, Amount) to get real-time fraud predictions

---

## 🧠 Model Comparison

| Model               | Accuracy | Precision | Recall | F1 Score | ROC AUC |
|---------------------|----------|-----------|--------|----------|---------|
| Logistic Regression | ~0.9736  | ~0.97     | ~0.62  | ~0.76    | ~0.97   |
| Decision Tree       | ~0.9993  | ~0.75     | ~0.74  | ~0.75    | ~0.87   |
| Random Forest       | ~0.9996  | ~0.95     | ~0.80  | ~0.87    | ~0.98   |
| Gradient Boosting   | ~0.9995  | ~0.88     | ~0.74  | ~0.80    | ~0.98   |
| XGBoost             | ~0.9997  | ~0.92     | ~0.83  | ~0.87    | ~0.99   |

> ✅ **Best Model:** XGBoost (with RandomizedSearchCV hyperparameter tuning)

---

## 📈 Key Results & Techniques

### Data Preprocessing
- **SMOTE (Synthetic Minority Over-sampling Technique)**: Applied to handle severe class imbalance (0.172% → 50/50 balanced training set)
- **RobustScaler**: Used for `Time` and `Amount` features (resistant to outliers)
- **Train-Test Split**: 80/20 stratified split to preserve class distribution

### Model Performance
- **ROC AUC Score** of best tuned model: **~0.99**
- **Recall** (fraud detection sensitivity): **~0.83–0.85+** (critical for fraud detection)
- **Precision**: **~0.92+** (minimizes false positives)

### Hyperparameter Tuning
- **RandomizedSearchCV** for optimal hyperparameter selection
- **Cross-validation** (5-fold) for robust model evaluation
- **ROC AUC** chosen as the primary evaluation metric

---

## 🌐 Flask Web Application Features

- **Dark Glassmorphism UI** with gradient backgrounds and smooth animations
- **30-Feature Input Form**: Time, V1–V28, Amount
- **Real-time Predictions**: Instant fraud/legitimate classification with probability score
- **Animated Prediction Badge**: Visual indication of fraud risk with confidence percentage
- **Loading Spinner**: Smooth UX during inference
- **Client-side Input Validation**: Pre-submission validation with error messages
- **Fully Mobile Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Health Check Endpoint**: `/health` for monitoring model status

---

## 📡 API Endpoints

### GET `/`
Renders the main prediction page with the interactive form.

### POST `/predict`
Accepts JSON with 30 feature values and returns fraud prediction.

**Request Example:**
```json
{
    "Time": 0.0,
    "V1": -1.35,
    "V2": -0.73,
    ...
    "V28": -0.02,
    "Amount": 149.62
}
```

**Response Example:**
```json
{
    "prediction": 1,
    "label": "Fraud",
    "fraud_probability": 87.45,
    "confidence": 87.45
}
```

### GET `/health`
Returns the health status of the model and application.

**Response:**
```json
{
    "status": "ok",
    "model_loaded": true
}
```

---

## 🔮 Future Scope

1. **Deep Learning Models** — LSTM / Autoencoder for sequence-based anomaly detection
2. **Real-time Streaming** — Apache Kafka + Flink for live transaction monitoring
3. **Model Explainability** — SHAP / LIME for feature importance and prediction explanations
4. **Model Monitoring** — MLflow + Evidently AI for data drift and model performance tracking
5. **REST API Enhancement** — FastAPI for async predictions and batch processing
6. **Containerization** — Docker + Docker Compose for easy deployment
7. **Cloud Deployment** — AWS SageMaker / GCP Vertex AI / Azure ML
8. **Federated Learning** — Privacy-preserving distributed training across institutions

---

## 🛠️ Technology Stack

### Data Science & ML
- **pandas** — Data manipulation and analysis
- **numpy** — Numerical computing
- **scikit-learn** — Machine learning algorithms and preprocessing
- **XGBoost** — Gradient boosting framework
- **imbalanced-learn** — SMOTE and class imbalance handling
- **matplotlib & seaborn** — Data visualization
- **scipy** — Scientific computing

### Web Framework
- **Flask** — Lightweight Python web framework
- **Werkzeug** — WSGI utilities and routing

### Notebook & Development
- **Jupyter Notebook** — Interactive data science environment
- **JupyterLab** — Enhanced notebook interface
- **IPykernel** — Jupyter kernel for Python

---

## 📦 Dependencies

For a complete list of dependencies, see `requirements.txt`:

```
flask>=3.0.0
pandas>=2.0.0
numpy>=1.24.0
matplotlib>=3.7.0
seaborn>=0.12.0
scikit-learn>=1.3.0
imbalanced-learn>=0.10.0
xgboost>=2.0.0
joblib>=1.3.0
notebook>=7.0.0
jupyterlab>=4.0.0
ipykernel>=6.0.0
scipy>=1.10.0
Werkzeug>=3.0.0
```

---

## 📸 Screenshots

| Feature | Description |
|---------|-------------|
| **Home Page** | Interactive form with 30 input fields and glassmorphism UI |
| **Prediction Result** | Real-time fraud classification with confidence percentage |
| **Model Performance** | Confusion matrix and ROC-AUC curve visualization |

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

For major changes, please open an issue first to discuss your proposed changes.

---

## 📝 License

This project is licensed under the **MIT License** — see the LICENSE file for details.

---

## 👨‍💻 Author

**Ameya Jarvis**  
🔗 [GitHub](https://github.com/ameya-jarvis-07) | [Repository](https://github.com/ameya-jarvis-07/CreditCardFraud-ML-Model)

---

## 🙏 Acknowledgments

- **Dataset**: [Kaggle - Credit Card Fraud Detection](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud)
- **Inspiration**: Machine learning best practices for production-ready systems
- **Tools**: Open-source Python libraries (pandas, scikit-learn, XGBoost, Flask)

---

> ⭐ If you found this project helpful, please give it a star on GitHub and share it with others!
