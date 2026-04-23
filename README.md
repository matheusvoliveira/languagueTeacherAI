# 🌍 Language Teacher AI

Practice languages with an AI tutor built with **React**, **Node.js**, **OpenAI**, **Firebase**, and **Stripe**.

## ✨ What It Does

- 💬 Real-time chat practice in multiple languages
- 🧠 Grammar correction and guided conversation
- 🔐 Firebase authentication and user data storage
- 💳 Stripe subscription flow
- 🎙️ Audio reply support in part of the chat flow

## 🧱 Project Structure

```text
.
├── client/   # React frontend
└── server/   # Express API, OpenAI, Firebase Admin, Stripe
```

## 🚀 Tech Stack

- Frontend: React
- Backend: Express
- AI: OpenAI API
- Auth/Database: Firebase
- Payments: Stripe

## ⚙️ Environment Setup

This repository no longer stores private credentials in source control. Use local `.env` files instead.

### `server/.env`

Use [`server/.env.example`](server/.env.example) as the template.

Required values:

```env
PORT=8800
CLIENT_APP_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000

OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_MONTHLY_PRICE_ID=price_xxx_monthly
STRIPE_QUARTERLY_PRICE_ID=price_xxx_quarterly

FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
FIREBASE_SERVICE_ACCOUNT_PATH=./config/service-account.json

DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

You can also provide Firebase Admin credentials with `FIREBASE_SERVICE_ACCOUNT_JSON` instead of a local file path.

### `client/.env`

Use [`client/.env.example`](client/.env.example) as the template.

```env
REACT_APP_API_URL=http://localhost:8800
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 🛠️ Run Locally

### 1. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Start the backend

```bash
cd server
npm start
```

### 3. Start the frontend

```bash
cd client
npm start
```

## 🔒 Security Notes

- ✅ Removed versioned private Firebase Admin credentials
- ✅ Removed hardcoded production domains and local machine endpoints from source files
- ✅ Moved sensitive runtime values to environment variables
- ✅ Ignored generated build output and secret config files

## 🧪 Available Scripts

### Server

```bash
npm start
npm run dev
```

### Client

```bash
npm start
npm run build
npm test
```

## 📌 Notes

- The frontend now reads API and Firebase settings from environment variables.
- The backend now reads Firebase Admin, Stripe, CORS, app URL, and database settings from environment variables.
- `client/build/` is treated as generated output and should be recreated with a fresh production build.
