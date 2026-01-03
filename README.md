# Visualize Patterns & Algorithms

A "One-Stop Shop" interactive code academy for Design Patterns, Data Structures, ML Algorithms, and Math Foundations.
Built with **Vue 3 + Vite + TypeScript**.

## 🚀 Features
- **Interactive Visualizations**: Dynamic graphs, sorting animations, and logic trees.
- **Code Playground**: Real-time TypeScript sandbox with tests.
- **AI Coach**: Integrated LLM support for code explanation and validation.
- **Progress Tracking**: LocalStorage-based mastery tracking with gamification.

## 🛠️ Setup & Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Locally**
   ```bash
   npm run dev
   ```

3. **Run Tests**
   ```bash
   npm run test:unit
   ```

## 🧠 AI Integration (Optional)

This project uses OpenAI to provide "Explain This" and "Coach" features.
To enable Real AI mode (instead of mock responses):

1. **Get an API Key**:
   - Go to [platform.openai.com](https://platform.openai.com).
   - Sign up/Login and create a new secret key under **API Keys**.
   - Make sure you have some credits/billing set up.

2. **Configure Environment**:
   - Create a `.env` file in the root:
     ```bash
     OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxx
     VITE_USE_REAL_AI=true
     ```

## ☁️ Deployment (Netlify)

This project is configured for **Netlify Functions**.
1. Push to GitHub.
2. Connect repository to Netlify.
3. In **Site Settings > Environment Variables**, add:
   - `OPENAI_API_KEY`: (Your key starting with sk-...)

