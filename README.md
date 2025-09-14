# SABO Arena - Mobile App

React Native mobile application for SABO Arena gaming platform.

## Tech Stack
- **Framework**: React Native + Expo 53.0.4
- **Backend**: TRPC + Supabase
- **Styling**: React Native StyleSheet
- **State**: React Context + TRPC
- **Build**: Metro bundler

## Project Structure
```
app/              # App screens (Expo Router)
├── (tabs)/       # Tab-based navigation
components/       # UI components (organized by feature)
packages/         # Shared packages/utilities
supabase/         # Database & serverless functions
backend/          # TRPC API routes
```

## Getting Started
```bash
npm install
npm start
```

## Documentation
- [Architecture Overview](./docs/FINAL_COMPONENT_ARCHITECTURE.md)
- [Team Collaboration Guide](./docs/TEAM_COLLABORATION_GUIDE.md)
- [Business Logic Review](./docs/SHARED_BUSINESS_LOGIC_REVIEW.md)