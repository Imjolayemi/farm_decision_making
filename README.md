# FarmWise AI 🌱

**An Intelligent, AI-Powered Agricultural Decision-Support Platform Built for the Nigerian Market.**

FarmWise AI is a complete digital ecosystem built to eliminate guesswork and post-harvest losses for smallholder and commercial farmers. By utilizing progressive web architecture, actual machine learning models, and offline-resilient technologies, it places expert agronomy and financial forecasting straight into the hands of those who need it most.

---

## 🌟 Key Features

1. **Crop Advisor:** Uses a Random Forest ML model trained on explicit soil chemistry datasets (N, P, K, pH) to recommend the optimal cash crop specifically tailored to your land's health.
2. **Disease Detector (Computer Vision):** Translates standard smartphone cameras into plant pathologists. Powered by a MobileNetV2 architecture fine-tuned on the PlantVillage dataset to instantly identify crop diseases via image upload.
3. **Market Hub & Forecaster:** Visualizes real-time commodity data and implements Facebook's Prophet time-series algorithm to predict pricing spikes for up to 30 days in the future.
4. **Offline Capability & USSD:** Guaranteed operability. A built-in Service Worker secures access deep into rural grids. In complete isolation, farmers dial the `*347*123#` routing gateway to get SMS price drops out of the backend.
5. **Farm Health Credit Scoring:** Seamlessly generates a trusted credit profile out of a user's engagement metrics to qualify previously unbanked farmers for Ag-loans directly inside the App.

---

## 🛠️ Architecture

* **Frontend:** React.js powered by Vite, operating as a strict Progressive Web App. Seamless Desktop-to-Mobile responsiveness configured exclusively with Tailwind & CSS Grid.
* **Backend:** Asynchronous Python FastAPI backend supporting lightning-fast localized ML model inference.
* **Data Layer:** Secured via Firebase (Authentication + Firestore) allowing anonymous testing flows or strict email-gated accounts.
* **Machine Learning Pipelines:** Standalone Jupyter (.ipynb) notebooks pulling remote authentic sets directly into Pandas for model reproducibility. 

---

## 🚀 Quick Start Guide

### 1. The React App (Frontend)
```bash
cd frontend
npm install
npm run dev
```

*Note: You must inject your unique Firebase SDK keys inside `frontend/.env`. If you just want to test the UI flow, launch the app to the Sign In page and click 'Enter Demo Mode Without Firebase' to bypass live authentication.*

### 2. The FastAPI Server (Backend)
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate | Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
API Documentation will instantly host at `http://localhost:8000/docs`

### 3. ML Model Retraining
All ML workflows live directly inside the root `ml/` tracking directory. Launch any Notebook directly through VS Code or Jupyter Lab, and run all core cells to recreate the serialized `.pkl` and `.h5` objects natively.

---

## 📈 Impact

Agriculture demands hard truth in volatile environments. FarmWise AI abstracts brutal financial complexities and deep computational mathematics away into a clean, simple, and hyper-reliable smartphone interface capable of driving massive economic upside directly to local growers.

***Stop Guessing. Start Growing.***
