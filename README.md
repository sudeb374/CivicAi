<div align="center">

# 🏛️ CivicAI

### AI for Digital Public Infrastructure & Governance

<p>
  <strong>Turning citizen voices into actionable infrastructure priorities.</strong>
</p>

<p>
  A multilingual AI-powered civic intelligence platform that transforms
  citizen complaints and development requests into structured,
  prioritized insights for government decision-making.
</p>

<br/>

<img src="https://img.shields.io/badge/AI-Gemini-blue?style=for-the-badge" />
<img src="https://img.shields.io/badge/Backend-FastAPI-green?style=for-the-badge" />
<img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge" />
<img src="https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge" />
<img src="https://img.shields.io/badge/Hackathon-2026-orange?style=for-the-badge" />

<br/><br/>

</div>

---

## 🌍 The Problem

Governments across India receive large amounts of citizen feedback through
different channels, languages, and systems.

However, citizen requests are often:

- Unstructured
- Written in different languages
- Difficult to categorize
- Difficult to compare geographically
- Difficult to prioritize
- Separated from infrastructure and demographic information

This makes it difficult for decision-makers to answer:

> **What is the problem? Where is it happening? How urgent is it? How many citizens are affected? What should be prioritized first?**

---

## 💡 Our Solution

<div align="center">

### 🗣️ Citizen Voice → 🤖 AI Understanding → ⚡ Priority → 🏛️ Government Decision

</div>

**CivicAI** creates an intelligence layer between citizens and government
decision-makers.

Citizens can submit development requests using **text or voice in their
local language**.

CivicAI then:

1. Understands the citizen's request
2. Detects the language
3. Translates when required
4. Identifies the sector and category
5. Extracts location when available
6. Determines urgency and severity
7. Calculates a priority score
8. Stores the structured complaint
9. Identifies demand hotspots
10. Generates decision-support recommendations

---

# ✨ Key Features

<table>
<tr>

<td width="50%" valign="top">

### 🎙️ Multilingual Complaints

Citizens can submit complaints through text or voice.

Supported inputs can include:

- 🇮🇳 Bengali
- 🇮🇳 Hindi
- 🇬🇧 English
- Other supported languages

The original citizen input is preserved while AI converts it into structured
civic information.

</td>

<td width="50%" valign="top">

### 🤖 AI Complaint Analysis

AI analyzes unstructured citizen requests and extracts:

- Language
- Translation
- Sector
- Category
- Location
- Urgency
- Severity
- Summary
- Recommended action

</td>

</tr>

<tr>

<td width="50%" valign="top">

### ⚡ Priority Engine

Every complaint does not require the same level of attention.

CivicAI uses a backend Priority Engine to calculate a priority score based on
the structured complaint information.

The frontend does not independently calculate priority.

</td>

<td width="50%" valign="top">

### 🔥 Demand Hotspots

Multiple complaints can indicate a larger community-level problem.

CivicAI aggregates requests by location and sector to identify areas with
concentrated civic demand.

</td>

</tr>

<tr>

<td width="50%" valign="top">

### 🏛️ Government Insights

Government officials can view aggregated information including:

- Complaint volume
- Sector distribution
- Urgency
- Severity
- Status
- Priority issues
- Demand hotspots

</td>

<td width="50%" valign="top">

### 💡 AI Recommendations

CivicAI can generate recommendations from analyzed high-priority civic
demands to help officials understand what action may deserve attention.

</td>

</tr>
</table>

---

# 🧠 How CivicAI Works

<div align="center">

```text
                    👥 CITIZENS
                         │
               ┌─────────┴─────────┐
               │                   │
             📝 Text             🎙️ Voice
               │                   │
               └─────────┬─────────┘
                         ↓
                 🌐 React Frontend
                         │
                    HTTP / REST
                         ↓
                 ⚡ FastAPI Backend
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ↓              ↓              ↓
     🤖 AI Service    🗄️ SQLite    ⚡ Priority Engine
          │              │              │
          └──────────────┼──────────────┘
                         ↓
                 📊 Aggregation Layer
                         │
             ┌───────────┼───────────┐
             ↓           ↓           ↓
          🔥 Hotspots  ⚠️ Issues   💡 Recommendations
             │           │           │
             └───────────┼───────────┘
                         ↓
                 🏛️ Government
                    Dashboard
