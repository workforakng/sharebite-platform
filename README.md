# 🍽️ ShareBite AI Rescue Assistant — Zero Food Waste. Zero Hunger. (SDG 2)

**🚀 Live Production:** [https://sharebite-platform.vercel.app](https://sharebite-platform.vercel.app)

ShareBite AI Rescue Assistant is an upgraded, intelligent food rescue ecosystem built for the **IBM SkillsBuild AI Automation and Intelligent Solutions internship**. By bridging the gap between surplus-rich environments and food-insecure communities, we turn potential waste into vital nutrition.

> *"Every Action Counts. Hunger is Solvable. From reducing your own food waste to advocating for fair agricultural trade policies — individuals, communities, and governments all have a role to play in achieving Zero Hunger by 2030."*

---

## 🤖 AI-Powered Features
- **Food Item Classifier:** Detects category, urgency, and rescue priority.
- **Expiry Recommender:** Suggests safe expiry windows automatically based on food type.
- **Rescue Matcher:** Suggests the best NGO/volunteer match based on location and urgency.
- **Rescue Summary Generator:** Automatically creates a short history entry for a rescue.
- **Donor Assistant:** An AI helper for users to ask questions about listing and the rescue flow.
- **Admin Risk Flagging:** Detects suspicious, duplicate, or low-confidence listings.
- **Alert Automation:** Prepares notification hooks for high-priority listings.
- **Analytics Helper:** Summarizes impact metrics like meals saved, active donors, and trends.

## 🌍 Strategic Impact
- **Malnutrition Mitigation:** Direct-to-NGO pipeline for surplus edible food.
- **Waste Reduction:** Smart expiry tracking (Prepared vs. Packaged) to maximize rescue efficiency.
- **Sustainable Logistics:** Localized feed for rapid collection and distribution.
- **Full Transparency:** Public 'History' log to celebrate every completed rescue.
- **📍 Official Kolkata Launch:** Now active in **New Town, Kolkata**.

## 🛠 Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (Neon) & Prisma ORM
- **Auth:** NextAuth.js (Secure Bcrypt hashing)
- **AI Integration:** Google Gemini, NVIDIA NIM, Mock Fallback
- **Deployment:** Vercel

---

## ⚙️ Setup Instructions for AI

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
3. Configure your AI Provider in `.env`:
   ```env
   AI_PROVIDER=mock      # Options: 'mock', 'gemini', 'nim'
   GEMINI_API_KEY=your_google_gemini_key
   NIM_API_KEY=your_nvidia_nim_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

**Developed with ❤️ by [AkNG](https://github.com/workforakng)**  
*Supporting the global movement for a hunger-free world by 2030.*  
GitHub: [@workforakng](https://github.com/workforakng)
