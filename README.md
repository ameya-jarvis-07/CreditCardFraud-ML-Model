# Credit Card Fraud Detection 🛡️

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.5.0-orange?style=for-the-badge&logo=scikit-learn)
![Flask](https://img.shields.io/badge/Flask-3.0.3-black?style=for-the-badge&logo=flask)
![XGBoost](https://img.shields.io/badge/XGBoost-2.0.3-green?style=for-the-badge)
![SMOTE](https://img.shields.io/badge/SMOTE-Imbalanced--Learn-red?style=for-the-badge)

---

## 📋 Project Description

This is a **production-ready, end-to-end Machine Learning project** for detecting fraudulent credit card transactions. The project covers the complete ML lifecycle — from Exploratory Data Analysis (EDA) and feature engineering, to model training, evaluation, hyperparameter tuning, model persistence, and deployment via a Flask web application with a stunning modern UI.

The dataset contains transactions made by European cardholders in September 2013. It presents transactions that occurred over two days, with 492 frauds out of 284,807 transactions — making it highly imbalanced with the positive class (frauds) accounting for only **0.172%** of all transactions.

---

## 📁 Project Structure

```
CreditCardFraud/
│
├── fraud_detection.ipynb          # Main Jupyter Notebook (42 cells)
├── app.py                         # Flask Web Application
├── requirements.txt               # Python Dependencies
├── README.md                      # Project Documentation
├── creditcard.csv                 # Dataset (Kaggle)
├── best_fraud_detection_model.pkl # Trained Best Model
├── preprocessing_pipeline.pkl    # Preprocessing Pipeline
│
├── templates/
│   └── index.html                 # Frontend HTML Template
│
├── static/
│   ├── css/
│   │   └── style.css              # Professional Styling
│   └── js/
│       └── script.js              # Client-side Validation & Animations
│
└── screenshots/
    ├── home.png
    ├── prediction.png
    └── confusion_matrix.png
```

---

## 📊 Dataset

| Property         | Value                                      |
|------------------|--------------------------------------------|
| **Source**       | [Kaggle - Credit Card Fraud Detection](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud) |
| **Rows**         | 284,807 transactions                       |
| **Columns**      | 31 (Time, V1–V28, Amount, Class)           |
| **Fraudulent**   | 492 (0.172%)                               |
| **Legitimate**   | 284,315 (99.828%)                          |
| **Features**     | PCA-transformed (V1–V28) + Time + Amount   |
| **Target**       | Class (0 = Legitimate, 1 = Fraud)          |

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/CreditCardFraud-ML-Model.git
cd CreditCardFraudDetection
```

### 2. Create a Virtual Environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### 3. Install Requirements
```bash
pip install -r requirements.txt
```

### 4. Download the Dataset
Download `creditcard.csv` from [Kaggle](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud) and place it in the root directory.

---

## 🚀 How to Run

### Run the Jupyter Notebook
```bash
jupyter notebook fraud_detection.ipynb
```
> Run all cells from top to bottom. This will train the models and save:
> - `best_fraud_detection_model.pkl`
> - `preprocessing_pipeline.pkl`

### Launch the Flask Web Application
```bash
python app.py
```
Then open your browser and go to: **http://127.0.0.1:5000**

---

## 🧠 Model Comparison

| Model               | Accuracy | Precision | Recall | F1 Score | ROC AUC |
|---------------------|----------|-----------|--------|----------|---------|
| Logistic Regression | ~0.9736  | ~0.97     | ~0.62  | ~0.76    | ~0.97   |
| Decision Tree       | ~0.9993  | ~0.75     | ~0.74  | ~0.75    | ~0.87   |
| Random Forest       | ~0.9996  | ~0.95     | ~0.80  | ~0.87    | ~0.98   |
| Gradient Boosting   | ~0.9995  | ~0.88     | ~0.74  | ~0.80    | ~0.98   |
| XGBoost             | ~0.9997  | ~0.92     | ~0.83  | ~0.87    | ~0.99   |

> ✅ **Best Model:** XGBoost (or Random Forest) tuned with `RandomizedSearchCV`

---

## 📈 Results

- **SMOTE** was applied to handle severe class imbalance (from 0.172% fraud to balanced 50/50 training set)
- **RobustScaler** was used for `Time` and `Amount` features (resistant to outliers)
- **ROC AUC Score** of the best tuned model: **~0.99**
- **Recall** (most important metric for fraud detection): **~0.85+**

---

## 🌐 Flask Web Application Features

- **Dark glassmorphism UI** with gradient backgrounds
- **30-feature input form** (Time, V1–V28, Amount)
- **Real-time prediction** with probability score
- **Animated prediction badge** (Fraud / Legitimate)
- **Loading spinner** during inference
- **Client-side input validation**
- **Fully mobile responsive**

---

## 🔮 Future Scope

1. **Deep Learning Models** — LSTM / Autoencoder for anomaly detection
2. **Real-time Streaming** — Apache Kafka + Flink for live transaction monitoring
3. **Explainability** — SHAP / LIME for model interpretability
4. **Model Monitoring** — MLflow + Evidently AI for drift detection
5. **API Deployment** — FastAPI + Docker + Kubernetes
6. **Cloud Deployment** — AWS SageMaker / GCP Vertex AI
7. **Federated Learning** — Privacy-preserving training across banks

---

## 📸 Screenshots

| Home Page | Prediction Result |
|-----------|-------------------|
| ![Home](screenshots/home.png) | ![Prediction](screenshots/prediction.png) |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 📝 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

**Your Name**  
📧 your.email@example.com  
🔗 [LinkedIn](https://linkedin.com/in/yourprofile) | [GitHub](https://github.com/yourusername)

---

> ⭐ If you found this project helpful, please give it a star on GitHub!
