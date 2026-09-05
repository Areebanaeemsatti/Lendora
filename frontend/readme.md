
# 🏦 Lendora — AI-Powered Alternative Credit Scoring Portal

**Lendora** is an AI-driven creditworthiness assessment platform designed for Pakistan’s informal workforce (rickshaw drivers, street vendors, shopkeepers, and laborers). By analyzing alternative financial indicators—such as mobile recharge patterns, digital wallet activity (JazzCash/Easypaisa), and utility bill payment discipline—Lendora enables fair and transparent micro-lending decisions.

This directory houses the **Next.js Frontend Client Application** designed for borrowers and risk underwriters.

---

## 🚀 Key Features Built

* **Borrower Application Portal (`/new-application`):**
  * Multi-step dynamic form capturing basic info, financial profile, utility bill IDs, and alternative telecom/wallet signals.
  * Local state management and instant validation before submission.

* **Underwriter Risk Assessment Dashboard (`/risk-assessments`):**
  * Real-time applicant processing queue with calculated **Informal Creditworthiness Scores**.
  * Visual status badges (`Approved`, `Manual Review`, `Rejected`).
  * Deep-dive risk breakdown cards for borrower financial profiles.

* **Explainable AI (SHAP) Visualizer (`ShapModal`):**
  * Interactive modal displaying positive and negative score drivers.
  * Transparent risk breakdown helping underwriters understand *why* an applicant received a specific credit score.

* **SME Telecom & Utility Signal Feed (`/telecom-feed`):**
  * Live monitoring view displaying alternative data signals (recharge stability, bill delay indices, wallet velocity).

---

## 🛠️ Tech Stack & Architecture

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Custom Dark / Emerald Green Theme)
* **Icons & UI:** Lucide React, Custom UI Components (`Button`, `Card`, `Badge`, `Input`, `Select`)
* **State & Storage:** React Context API (`ApplicationsProvider`) & Local Storage (`lib/storage.ts`)
* **Mock Data Layer:** Pre-configured mock contract (`lib/mockData.ts`) matching backend ML response schemas.

---

## 📂 Frontend Directory Structure

```text
frontend/
├── app/
│   ├── layout.tsx                # Root layout wrapper with theme and providers
│   ├── page.tsx                  # Home / Dashboard overview
│   ├── new-application/          # Borrower application form page
│   ├── risk-assessments/         # Underwriter assessment dashboard page
│   └── telecom-feed/             # SME utility & telecom monitoring feed
├── components/
│   ├── application/              # Step-by-step borrower form section components
│   ├── assessment/               # Risk assessment and borrower overview cards
│   ├── dashboard/                # Analytics, portfolio stats, and recent tables
│   ├── layout/                   # Sidebar, Header, and AppLayout wrappers
│   ├── ui/                       # Reusable primitives (Card, Badge, Button, Input)
│   └── ShapModal.tsx             # Explainable AI (SHAP) visual breakdown modal
├── lib/
│   ├── mockData.ts               # Fallback mock datasets for standalone testing
│   └── storage.ts                # Local storage persistence helpers
└── types/
    └── index.ts                  # TypeScript interface contracts for Borrower & ML data
```
Prerequisites & Environment Setup
Before running the project, ensure you have the following installed on your machine:

Node.js: v18.0.0 or higher (Download Node.js)

npm: v9.0.0 or higher (comes bundled with Node.js) or yarn / pnpm

Git: Version control (Download Git)

Getting Started & Installation
1. Clone the Repository
   ```
   git clone [https://github.com/Areebanaeemsatti/Lendora.git](https://github.com/Areebanaeemsatti/Lendora.git)
   cd Lendora/frontend
   
   ```
   2. Install Frontend Dependencies
          install all required packages (next, react, tailwindCSS, lucide-react, clsx, tailwind-merge, etc.)
   3.  Key Package Dependencies Installed
              If setting up from scratch, these are the core dependencies required for the frontend build:
        ```
        npm install next react react-dom lucide-react clsx tailwind-merge
        npm install -D typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer

        ```
    4. Start Development Server
       ```
            npm run dev
        ```
       Visit http://localhost in your browser to access the live portal.

       ---

## ✒️ Author & Acknowledgments

**Areeba Naeem Satti**  
*Lead Frontend Developer & UI/UX Designer — Lendora*  
* **GitHub:** [@Areebanaeemsatti](https://github.com/Areebanaeemsatti)  
* **Role:** Architectural design of Next.js frontend, Borrower Application workflows, Underwriter Risk Dashboard, and Explainable AI (SHAP) visualizer integration.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](../LICENSE) file for full details.

---

<p align="center">
  Developed for <b>IndusAI / Hackathon 2026</b> • Empowering Pakistan's Informal Workforce
</p>

   
