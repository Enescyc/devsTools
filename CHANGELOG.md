# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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

## [0.2.0] - 2024-01-01

### Added
- Hash Generator with multiple algorithms (MD5, SHA-1, SHA-256, SHA-512)
- UUID Generator with comprehensive features:
  - Support for v1, v4, v5, and NIL UUIDs
  - UUID validation and information
  - Bulk generation and sequential UUIDs
- Color Code Converter with HEX, RGB, and HSL support
- String Escape/Unescape tool with multiple modes (HTML, JavaScript, URL, Base64)
- Text Case Converter with support for camelCase, snake_case, PascalCase, and kebab-case
- Regex Tester with group support and real-time matching
- Text Diff Checker with line-by-line comparison
- History panel component for tracking operations
- Copy button component for easy clipboard access

### Changed
- Improved UI consistency across all tools
- Enhanced error handling and user feedback
- Updated component architecture for better maintainability
- Optimized performance for large text processing

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