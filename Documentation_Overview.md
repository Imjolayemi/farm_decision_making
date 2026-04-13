# FarmWise AI 🌾
**An Intelligent, AI-Powered Agricultural Decision-Support Platform Built for the Nigerian Market**

---

## 1. Introduction

**FarmWise AI** is a comprehensive, state-of-the-art Progressive Web Application (PWA) designed to revolutionize the way smallholder and commercial farmers in Nigeria make agricultural decisions. Transitioned from a legacy monolithic PHP architecture into a high-performance **React frontend** and a **FastAPI backend**, the platform leverages authentic Machine Learning (ML) data to provide real-time, actionable insights.

From selecting the perfect crop for specific soil metrics, to detecting plant diseases via smartphone cameras, predicting the future market prices of commodities, and calculating farm-health credit scores to unlock micro-loans—FarmWise AI is an end-to-end digital ecosystem for the modern farmer.

---

## 2. Aims and Objectives

### Primary Aim
To democratize access to advanced agricultural intelligence, making precision farming accessible, affordable, and actionable for every farmer regardless of their technological literacy or geographic location.

### Key Objectives
1. **Optimize Crop Yields:** Eliminate guesswork by using data science to match soil chemistry (N, P, K, pH) with the highest-yielding crop varieties.
2. **Mitigate Disease Outbreaks:** Provide early detection of crop diseases using computer vision to prevent widespread harvest losses.
3. **Maximize Revenue:** Empower farmers with predictive market pricing, enabling them to sell commodities when prices peak rather than at blind harvest times.
4. **Foster Financial Inclusion:** Track farm activity to generate a dynamic Credit Score, bridging the gap between unbanked farmers and active micro-lending agricultural banks.
5. **Ensure Uninterrupted Access (Offline & USSD):** Overcome internet scarcity by designing the app to work fully offline (PWA Service Workers) and extending core AI features to feature phones via a USSD shortcode (`*347*123#`).

---

## 3. The Purpose of FarmWise AI to Society

In Nigeria and across Sub-Saharan Africa, agriculture employs over 35% of the population, yet the sector suffers from staggering post-harvest losses, lack of agronomist extension workers, and extreme climate volatility.

FarmWise AI serves society by directly tackling food insecurity and agricultural poverty:
- **For the Farmer:** Increases net income by minimizing fertilizer waste, timing the market perfectly, and saving crops from preventable diseases.
- **For Rural Communities:** Fosters a collaborative ecosystem where farmers can share warnings (e.g., "Armyworm outbreak in Kano") and rent heavy machinery to each other affordably via the Community tab.
- **For the Economy:** Links active, capable farmers to financial institutions safely, turning untracked rural farming into scalable agritech businesses through the Farm Health Credit Score algorithm. 

---

## 4. Comprehensive Feature Breakdown & Uses

The platform is divided into uniquely powerful, independent modules that come together to form the farmer's ultimate dashboard.

### A. The Dashboard (Command Center)
- **What it does:** The main entry point. Provides a high-level summary of the farm's health.
- **Use case:** A farmer logs in for 30 seconds to check today's weather, see recent community alerts, and check if their overall "Farm Activity Score" has improved.

### B. AI Crop Advisor
- **What it does:** An intuitive interface where farmers input their soil's Nitrogen, Phosphorous, Potassium (NPK) levels, pH, and location.
- **How it works:** Transmits data to the FastAPI backend, where a Machine Learning classification model (Decision Tree / Random Forest trained on authentic Kaggle data) instantly calculates the optimal crop.
- **Use case:** A farmer acquires a new plot of land, tests the soil, and uses FarmWise to decide whether they will profit more by planting Cassava, Maize, or Sorghum this season.

### C. AI Disease Detector (Computer Vision)
- **What it does:** Turns a standard smartphone camera into an expert plant pathologist. 
- **How it works:** Utilizing a MobileNetV2 Convolutional Neural Network trained on the massive PlantVillage dataset, it scans a photo of a sick leaf and identifies diseases (e.g., *Tomato Early Blight*, *Cassava Mosaic*).
- **Use case:** A farmer notices yellowing leaves. They snap a photo in the app. FarmWise AI immediately diagnoses it and provides an exact chemical/pesticide treatment plan to stop the spread.

### D. Market Hub & Price Forecaster
- **What it does:** A financial terminal for crop commodities. Shows live prices across major Nigerian markets (Lagos, Kano, Onitsha).
- **How it works:** Uses Facebook's Prophet forecasting algorithm (trained dynamically via Yahoo Finance data APIs) to present 30-day projected price trajectories on interactive area charts.
- **Use case:** A farmer harvests 500kg of Yam. Instead of selling immediately to a middleman at a loss, the Market Hub reveals prices are expected to rise by 12% next week. The farmer holds their stock to maximize profit.

### E. Weather & Irrigation Intelligence
- **What it does:** Provides 7-day hyper-local weather forecasts based on major Nigerian agro-ecological zones.
- **How it works:** Synthesizes temperature, humidity, and rainfall percentages to output plain-English *Irrigation Advice*.
- **Use case:** FarmWise tells the farmer: *"80% chance of rain tonight. Skip irrigation today to save water and pump fuel costs."*

### F. Global Community & Equipment Rental
- **What it does:** A real-time social feed operating on Firebase Firestore. 
- **Use case:** 
  - **Feed:** A farmer asks a question about weed control, and veteran farmers reply with advice. 
  - **Equipment Marketplace:** A farmer who owns a tractor lists it for daily rental (₦50,000/day). Neighboring farmers can tap "Rent" dynamically bridging the mechanization gap.

### G. Subscription & Micro-Loan Gateway (Credit Score)
- **What it does:** A monetization and fintech engine. Generates a 'Farm Health Score' based on app usage (scans, market checks, community posts).
- **How it works:** Integrates a seamless Paystack popup to allow users to upgrade from the *Free Tier* to *FarmWise Pro* or *AgriPro Elite* for unlimited scans.
- **Use case:** Once an Elite farmer crosses a credit score of 720, the "Apply for Agri-Loan" button activates, allowing them to instantly request a bank loan of up to ₦1,000,000 to buy fertilizers for the new season.

### H. Feature Phone USSD Integration (`*347*123#`)
- **What it does:** Allows completely offline, non-smartphone interaction.
- **How it works:** Python router (`ussd.py`) handles USSD gateway requests (e.g., Africa's Talking interface). 
- **Use case:** A rural farmer with no internet dial's the code and navigates numbered text menus to get the day's Maize price or their local weather.

---

## 5. Technology Stack & Machine Learning Architecture

FarmWise AI abandons obsolete stacks for modern enterprise technology:

### Frontend
- **React.js & Vite:** Powers a blazingly fast, component-driven Single Page Application.
- **Progressive Web App (PWA):** Installs securely on Android/iOS homescreens. Uses a `sw.js` Service Worker to cache static assets so the app opens smoothly without an internet connection.
- **Tailwind CSS & Vanilla Fusion:** Fluid, responsive CSS Grid layouts delivering an immaculate UX on massive desktop monitors and small 480px smartphones equally.

### Backend & Authentication
- **Python FastAPI:** Lightning-fast routing for AI API endpoints.
- **Firebase Auth & Firestore:** Realtime, secure document storage and Authentication. Contains an embedded *Demo Bypass Mode*.
- **Paystack:** Secure, inline payment gateways for subscription processing natively inside the React DOM.

### Artificial Intelligence via Jupyter Notebooks
- **Crop Classification:** Python `scikit-learn` Random Forest / Decision Trees.
- **Commodity Price Forecasting:** Time-series analysis via Facebook `Prophet` and `yfinance`.
- **Computer Vision:** Deep Learning via `TensorFlow` and `MobileNetV2` transfer learning.

---

## 6. Conclusion
FarmWise AI is not simply a digital ledger or farm diary; it is an active, predictive partner. By marrying agronomy with localized Machine Learning and Fintech, FarmWise AI directly addresses the systemic challenges of Nigerian agriculture, ultimately paving the way for maximum food security and generational wealth for local farmers.
