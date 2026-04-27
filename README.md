# ✦ Lumina Quiz — AI-Powered Quiz Platform

A stunning, futuristic quiz platform with glassmorphism UI, 3D visuals, and smooth animations.

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Sign-in methods: Email/Password + Google
4. Enable **Firestore Database** (start in test mode)
5. Copy your config from Project Settings → Your Apps

### 3. Configure Firebase

Open `src/firebase.js` and replace with your actual config:

```js
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 4. Firestore Rules

In Firebase Console → Firestore → Rules, set:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /quizzes/{quizId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == resource.data.createdBy;
      allow create: if request.auth != null;
    }
  }
}
```

### 5. Run

```bash
npm run dev
```

Visit `http://localhost:5173`

## 🎨 Features

- **Hero Page** — 3D floating spheres with React Three Fiber
- **Auth** — Email/password + Google sign-in
- **Quiz Creator** — Glassmorphic card UI with animated inputs
- **Quiz List** — 3D tilt cards with skeleton loading
- **Quiz Player** — Animated progress bar, slide transitions
- **Results** — Circular score, confetti on high score

## 🛠 Tech Stack

| Tech | Purpose |
|------|---------|
| React + Vite | App framework |
| Tailwind CSS | Utility styling |
| Framer Motion | Animations |
| React Three Fiber | 3D visuals |
| Firebase | Auth + Database |
| Canvas Confetti | Result celebration |

## 📁 Structure

```
src/
├── components/
│   ├── CustomCursor.jsx    # Glow cursor
│   ├── AmbientOrbs.jsx     # Background orbs
│   ├── Navbar.jsx          # Blurred navbar
│   ├── PageLoader.jsx      # Intro animation
│   ├── ProtectedRoute.jsx  # Auth guard
│   └── ThreeScene.jsx      # 3D canvas
├── context/
│   └── AuthContext.jsx     # Firebase auth
├── pages/
│   ├── HomePage.jsx        # Hero + features
│   ├── AuthPage.jsx        # Login/signup
│   ├── QuizCreate.jsx      # Create quizzes
│   ├── QuizList.jsx        # Browse quizzes
│   ├── QuizPlayer.jsx      # Play a quiz
│   └── ResultPage.jsx      # Score + confetti
├── firebase.js             # Firebase config
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## ⚡ Build for Production

```bash
npm run build
```