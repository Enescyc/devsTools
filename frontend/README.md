# DevToolbox Frontend

The frontend application for DevToolbox, built with React, TypeScript, and Vite.

## 🚀 Quick Start

### Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The development server will be available at `http://localhost:5173`

### Production Build

1. Build the application:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## 📦 Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   │   ├── ui/        # Reusable UI components
│   │   └── tools/     # Tool-specific components
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom hooks
│   ├── lib/          # Utility functions
│   ├── styles/       # Global styles
│   └── types/        # TypeScript types
└── tests/            # Frontend tests
```

## 🛠️ Tech Stack

- **Framework:** React with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **UI Components:** ShadcN UI
- **State Management:** React Context API
- **Testing:** Vitest + React Testing Library

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run coverage` - Generate test coverage report

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
VITE_NODE_ENV=development
```

## 🤝 Contributing

1. Follow the project's coding standards
2. Write tests for new features
3. Update documentation as needed
4. Create meaningful commit messages

## 📚 Documentation

- [Component Documentation](./docs/components.md)
- [API Integration](./docs/api.md)
- [Testing Guide](./docs/testing.md)