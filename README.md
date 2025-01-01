# DevToolbox 🛠️

A modern, fast, and feature-rich developer toolkit that consolidates essential development tools into one platform. Built with React, TypeScript, and Node.js.

## ✨ Features

### JSON Tools
- 🔍 JSON Formatter & Validator (Completed)
- 📝 JSON Minifier (Completed)
- 🔄 JSON to CSV/XML/YAML Converter (In Progress)
- 🎯 JSON Escape/Unescape (Completed)

### Text Tools
- ⚡ Text Case Converter (camelCase, snake_case, PascalCase, kebab-case) (Completed)
- 🔍 Regex Tester with Real-time Matching & Group Support (In Progress)
- ↔️ Text Diff Checker with Line-by-Line Comparison (Planned)
- 🔠 String Escape/Unescape (HTML, JavaScript, URL, Base64) (Completed)

### Utility Tools
- 🔐 Hash Generator (MD5, SHA-1, SHA-256, SHA-512) (In Progress)
- 🎲 UUID Generator (v1, v4, v5, NIL) with Validation (Completed)
- 🎨 Color Code Converter (HEX, RGB, HSL) (Planned)
- ⏰ Timestamp Converter (integrated with UUID v1) (Completed)

### Common Features Across All Tools
- 📋 Copy to Clipboard functionality (Completed)
- 📝 History tracking with restore capability (Completed)
- 🌓 Dark/Light theme support (Completed)
- ⚡ Real-time processing (Completed)
- 💾 Local storage for history entries (Completed)
- ⭐ Favorite entries support (Completed)

## 🚀 Getting Started

### Prerequisites
- Docker and Docker Compose (for containerized deployment)
- Node.js v18+ (for local development)
- npm or yarn (for local development)

### Production Deployment

1. Clone the repository
```bash
git clone https://github.com/yourusername/devtools.git
cd devtools
```

2. Set up environment files
```bash
# Frontend environment
cp frontend/.env.example frontend/.env.production
# Edit frontend/.env.production with your production values

# Backend environment
cp backend/.env.example backend/.env.production
# Edit backend/.env.production with your production values
```

3. Build and run with Docker Compose
```bash
docker-compose up --build
```

The application will be available at `http://localhost`

### Development Setup

1. Start with Docker (recommended)
```bash
docker-compose -f docker-compose.dev.yml up --build
```

2. Or run locally:
```bash
# Install and start backend
cd backend
npm install
npm run dev

# Install and start frontend
cd ../frontend
npm install
npm run dev
```

The development server will be available at `http://localhost:5173`

### Environment Variables

#### Frontend
- `VITE_API_URL`: Backend API URL
- `VITE_NODE_ENV`: Environment (development/production)

#### Backend
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGIN`: Allowed origin for CORS
- `RATE_LIMIT_WINDOW_MS`: Rate limiting window
- `RATE_LIMIT_MAX_REQUESTS`: Maximum requests per window

## 🔄 Upcoming Features

- [ ] Performance optimization for large JSON/text inputs
- [ ] Keyboard shortcuts for common operations
- [ ] Export functionality (save results to file)
- [ ] Additional conversion tools (CSV to JSON, XML to JSON)

## 🛠️ Built With

### Frontend
- **Framework:** React with TypeScript
- **Styling:** TailwindCSS
- **UI Components:** ShadcN UI
- **State Management:** React Context API
- **Build Tool:** Vite
- **Features:**
  - Real-time processing
  - History management
  - Theme switching
  - Copy to clipboard
  - Error handling

### Backend
- **Framework:** Node.js with Express
- **Language:** TypeScript
- **Architecture:** RESTful API
- **Testing:** Jest
- **Features:**
  - SOLID principles
  - Modular design
  - Error handling
  - Input validation

## 📝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

Give a ⭐️ if this project helped you! 