# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- UUID Generator API with v1, v4, v5 support
- Text Case Converter with multiple case formats
- String Escape/Unescape functionality
- Timestamp Converter integration
- Docker configuration for production and development environments
- Nginx configuration for production frontend
- Environment configuration management
- Production-ready deployment setup
- Development environment with hot-reloading
- History feature with local storage support
- Favorite entries functionality
- Copy to clipboard buttons across all tools
- Dark/Light theme support with smooth transitions
- Error handling and loading states
- Real-time processing for all tools
- Improved UI/UX with ShadcN components

### Changed
- Enhanced component architecture for better maintainability
- Improved error handling and user feedback
- Updated styling system with TailwindCSS
- Refactored state management using React Context
- Optimized build process with multi-stage Docker builds
- Updated TypeScript configuration for better type safety

### In Progress
- JSON to CSV/XML/YAML Converter
- Regex Tester with real-time matching
- Hash Generator implementation
- Performance optimizations for large inputs

### Fixed
- Text formatter state updates for case conversions
- String escaper mode selection and processing
- JSON formatter validation feedback
- UUID generator sequential timestamp handling

## [0.1.0] - 2023-12-30

### Added
- Initial release with core JSON tools
- JSON Formatter & Validator
- JSON Minifier
- JSON to CSV/XML/YAML Converter
- Basic project structure and documentation
- Frontend setup with React, TypeScript, and TailwindCSS
- Backend setup with Node.js, Express, and TypeScript
- Basic UI components with ShadcN UI 