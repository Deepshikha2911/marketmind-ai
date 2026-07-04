# MarketMind AI

> **An AI-Assisted Forecasting Utility for Digital Marketing Agencies**

MarketMind AI is an end-to-end marketing intelligence platform that helps businesses analyze advertising campaign performance, predict future revenue, optimize budgets, forecast growth, simulate marketing scenarios, and generate AI-powered business insights from campaign datasets.

---

## Overview

Marketing teams often struggle to transform large volumes of campaign data into actionable business decisions.

MarketMind AI solves this by combining **Machine Learning**, **Predictive Analytics**, and **Business Intelligence** into one unified platform.

Users simply upload a marketing dataset, and the platform automatically performs:

- Revenue Prediction
- AI Business Insights
- Budget Optimization
- Revenue Forecasting
- Scenario Simulation
- Executive-Level Analysis

---

# Features

## Dashboard
- Interactive analytics dashboard
- KPI cards
- Revenue trends
- Campaign overview
- AI recommendations

---

## Dataset Upload
- CSV upload support
- Dataset validation
- Automatic preprocessing
- Feature generation

---

## Revenue Prediction
Predict future campaign revenue using Machine Learning.

Features:
- Revenue prediction
- Prediction summary
- Campaign comparison
- Export predictions

---

## AI Insights
Automatically generate business insights such as:

- Campaign performance
- ROI analysis
- Budget utilization
- Trend analysis
- KPI summary
- Executive recommendations

---

## Budget Optimizer
AI recommends optimal marketing budget allocation.

Includes:
- Budget comparison
- ROI improvement
- Expected revenue increase
- Campaign recommendations

---

## Revenue Forecasting
Forecast future campaign performance using historical data.

Includes:
- Forecast charts
- Growth projections
- Risk analysis
- AI forecast summary

---

## Scenario Simulator
Simulate multiple business strategies including:

- Increase Budget
- Reduce Budget
- Pause Campaigns
- Improve CTR
- Improve Conversion Rate
- Revenue Growth Scenarios

---

## Complete AI Analysis
A unified executive dashboard combining:

- Predictions
- AI Insights
- Budget Optimization
- Revenue Forecast
- Scenario Simulation
- Business Recommendations

---

# Project Architecture

```
MarketMind AI
│
├── Frontend (Next.js)
│
├── Backend (FastAPI)
│
├── Machine Learning
│   ├── Data Preprocessing
│   ├── Feature Engineering
│   ├── Prediction Model
│   ├── Insight Generator
│   ├── Budget Optimizer
│   ├── Forecast Engine
│   └── Scenario Simulator
│
└── Reports & Outputs
```

---

# Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- Framer Motion

### Backend
- FastAPI
- Pydantic
- Pandas
- NumPy

### Machine Learning
- Scikit-learn
- XGBoost / Random Forest
- Feature Engineering
- Predictive Analytics

### Development Tools
- Git
- GitHub
- Cursor AI
- VS Code

---

# Installation

## Clone Repository

```bash
git clone https://github.com/Deepshikha2911/marketmind-ai.git
```

---

## Backend

```bash
cd backend

python -m venv .venv
```

Windows

```bash
.venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run

```bash
cd ..
uvicorn backend.app.main:app --reload
```

Backend runs at

```
http://localhost:8000
```

Swagger Docs

```
http://localhost:8000/docs
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

Runs at

```
http://localhost:3000
```

---

# Project Structure

```
backend/
│
└── app/
    ├── api/
    ├── schemas/
    ├── services/
    ├── config/
    ├── core/
    ├── exceptions/
    └── main.py

ml/
│
├── preprocessing/
├── features/
├── training/
├── insights/
├── optimizer/
├── forecasting/
└── simulator/

frontend/
│
├── public/
├── .next/
├── node_modules/
└── src/
    ├── app/
    ├── components/
    └── lib/
```

---

# API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/v1/health` | Health Check |
| POST | `/api/v1/predict` | Revenue Prediction |
| POST | `/api/v1/insights` | AI Insights |
| POST | `/api/v1/optimize-budget` | Budget Optimization |
| POST | `/api/v1/forecast` | Revenue Forecast |
| POST | `/api/v1/simulate` | Scenario Simulation |
| POST | `/api/v1/analyze` | Complete Analysis |

---

# Future Improvements

- User Authentication
- Database Integration
- Multi-user Dashboard
- Real-time Analytics
- LLM-powered Chat Assistant
- PDF Report Generation
- Cloud Deployment
- Docker Support

---

# Contributing

Contributions, issues, and feature requests are welcome.

Feel free to fork the repository and submit a pull request.

---

# License

This project is licensed under the MIT License.

---

# Author

**Deepshikha Chaurasia**

GitHub: https://github.com/Deepshikha2911

LinkedIn: https://www.linkedin.com/in/deepshikha2911/

**Abhinav Rajesh Nair**

GitHub: https://github.com/AbhinavX26

LinkedIn: https://www.linkedin.com/in/abhinav-nair-4a1601369/

---

⭐ If you found this project useful, consider giving it a star!
