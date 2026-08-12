# Driver State Intelligence

**AI-powered race engineering intelligence platform for understanding driver state, radio communication, and performance signals.**

## 🚀 Overview

Driver State Intelligence helps race engineers identify important signals from driver communication and race-session data.

The platform combines driver radio, driver state, telemetry, and performance information to provide contextual engineering insights.

## 🎯 Problem

During a racing session, engineers need to monitor multiple signals at the same time:

* Driver radio communication
* Driver state
* Lap and sector performance
* Tyre conditions
* Telemetry
* Performance trends

Important information can easily be missed when these signals are viewed separately.

## 💡 Our Solution

Our platform brings these signals together in one interactive dashboard.

```text
Driver Radio
     +
Telemetry
     +
Driver State
     ↓
AI Analysis
     ↓
Engineering Insight
```

Instead of only showing raw data, the system helps identify **what is happening, why it may be happening, and what the engineer should investigate.**

## ✨ Key Features

### 📻 Radio Analysis

* Driver radio transcript analysis
* Topic detection
* Sentiment detection
* Driver-state detection
* Confidence score
* Key phrase extraction

### 🧠 Driver State

Classifies driver state into:

* CALM
* CONCERNED
* STRESSED
* TIRED

### 📊 Performance Analysis

* Lap time
* Sector performance
* Lap delta
* Tyre information
* Tyre temperature
* Maximum speed
* Stress score

### 🔗 Correlation

Connects driver communication with performance and telemetry signals to identify meaningful patterns.

### 💡 Engineer Insights

Provides structured insights with:

* Priority
* Concern
* Evidence
* Related radio communication
* Suggested action

### 🕒 Session History

Allows engineers to search, filter, and analyze previous session events.

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Recharts
* Lucide React
* Motion

### Backend

* Node.js
* Express.js
* TypeScript
* REST API

### AI / ML

* Hugging Face
* Local model inference
* NLP / text classification

## 📁 Project Structure

```text
Driver-State-Intelligence/
│
├── frontend/
│   └── React + TypeScript application
│
├── backend/
│   └── Express + TypeScript API
│
└── README.md
```

## ▶️ Run Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## 🔌 Backend API

The backend provides APIs for:

```text
/api/drivers
/api/radio
/api/telemetry
/api/state
/api/performance
/api/correlation
/api/insights
/api/session-history
```

## 🤖 AI Pipeline

The AI component analyzes driver communication and combines it with available session information.

```text
Radio Transcript
       ↓
NLP / AI Model
       ↓
Driver State
Sentiment
Topic
Confidence
       ↓
Telemetry + Performance
       ↓
Engineering Insight
```

## 📌 Development Status

| Component            | Status         |
| -------------------- | -------------- |
| Frontend UI          | ✅ Completed    |
| Local State          | ✅ Completed    |
| Mock Data            | ✅ Completed    |
| Express Backend      | 🚧 In Progress |
| REST APIs            | 🚧 In Progress |
| AI / ML              | 🚧 In Progress |
| Frontend Integration | ⏳ Pending      |
| Final Testing        | ⏳ Pending      |

## 🏆 Hackathon Goal

Our goal is to build an intelligent race-engineering assistant that transforms fragmented driver communication and performance data into **clear, contextual, and actionable insights**.

---

**Built for the hackathon by our team.**
