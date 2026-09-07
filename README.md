# 🚀 Lendora

<div align="center">

### AI-Powered Credit Scoring & Risk Assessment Platform

**Empowering financial inclusion through alternative data, explainable AI, and smarter lending decisions.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Lendora-7C3AED?style=for-the-badge)](https://lendora-frontend-two.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Areebanaeemsatti/Lendora)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

</div>

---

## 🌟 About Lendora

**Lendora** is an AI-powered credit scoring and risk assessment platform designed for **thin-file and informal workers** who may not have sufficient traditional credit history.

Instead of relying only on conventional credit information, Lendora explores **alternative financial signals** to help underwriters make more informed lending decisions.

### Our approach

**Alternative Data + AI Risk Assessment + Explainable AI + Decision Support**

Our goal is to make credit assessment more:

- 🌍 Inclusive
- 🤖 Data-driven
- 🔍 Transparent
- ⚡ Efficient
- 🛡️ Explainable

---

## 🎯 The Problem

Millions of informal workers and underserved individuals have limited access to traditional financial services because they lack extensive credit histories.

Traditional credit scoring systems may struggle to evaluate these applicants because important financial behaviors are not always visible in conventional credit reports.

### Lendora explores alternative signals such as:

- 💰 Income patterns
- 💡 Utility payment history
- 📱 Mobile financial behavior
- 📊 Financial consistency
- 🔎 Alternative risk indicators

These signals help create a broader picture of an applicant's financial behavior.

---

# ✨ Key Features

### 📊 Underwriter Dashboard

A centralized dashboard that allows underwriters to:

- View incoming applications
- Track application status
- Review applicant information
- Monitor credit assessments
- Manage approval and rejection workflows

---

### 🧠 AI-Powered Credit Assessment

Lendora evaluates multiple alternative signals to generate an overall risk assessment.

The platform supports:

- Automated scoring
- Risk classification
- Financial behavior analysis
- Decision support for underwriters

---

### 🔍 Explainable AI

Lendora doesn't just provide a score.

It helps answer:

> **"Why did the applicant receive this score?"**

The SHAP-style explanation layer provides an interactive breakdown of:

- 🟢 Positive risk factors
- 🔴 Negative risk factors
- 📈 Feature contributions
- 🎯 Overall impact on the assessment

This makes AI-assisted lending decisions easier to understand and review.

---

### 📝 Borrower Application Intake

Applicants can submit their information through a structured, step-by-step application flow.

The platform collects relevant financial and alternative data signals and generates an automated assessment.

---

### 🛡️ Protected Application Experience

The application includes:

- Route protection
- Authentication hooks
- Structured TypeScript models
- Responsive UI
- Dark mode support
- Modern dashboard experience

---

# 🖥️ Core Modules

| Module | Description |
|---|---|
| 📊 **Dashboard** | Overview of applications and risk activity |
| 📝 **New Application** | Guided borrower application workflow |
| 🔍 **Risk Assessment** | Applicant credit and risk evaluation |
| 🤖 **Explainable AI** | Feature-level explanation of risk scores |
| 🔐 **Authentication** | Login and protected application routes |

---

# 🏗️ System Workflow

```text
                 ┌─────────────────────┐
                 │      Borrower       │
                 │   Application Form  │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │  Alternative Data   │
                 │      Signals        │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Risk Assessment   │
                 │       Engine        │
                 └──────────┬──────────┘
                            │
                  ┌─────────┴─────────┐
                  ▼                   ▼
          ┌───────────────┐   ┌────────────────┐
          │ Credit Score  │   │ Explainable AI │
          └───────┬───────┘   └───────┬────────┘
                  │                   │
                  └─────────┬─────────┘
                            ▼
                 ┌─────────────────────┐
                 │ Underwriter         │
                 │ Dashboard           │
                 └─────────────────────┘
