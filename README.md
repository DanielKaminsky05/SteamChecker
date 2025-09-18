# SteamChecker Search Backend API

A Node.js Express API that provides Steam user data retrieval, game library comparison, and AI-powered game recommendations using the Steam Web API and Google's Gemini AI.

## Features

- **User Search**: Search Steam users by Steam ID or vanity URL
- **User Details**: Get detailed user information including friends list and game library
- **Game Statistics**: Retrieve game-specific statistics and achievements
- **Library Comparison**: Compare game libraries between two users
- **AI Recommendations**: Get intelligent game recommendations using Google Gemini AI
- **Favorites Management**: Save and manage favorite Steam users with auto-refresh

## Prerequisites

- Node.js (v14 or higher)
- Steam Web API Key ([Get one here](https://steamcommunity.com/dev/apikey))
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
STEAM_API_KEY=your_steam_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

4. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

## API Endpoints

- **GET** `/api/search/:query` - Search for Steam user by ID or vanity URL
- **GET** `/api/user/:steamId/details` - Get user details including friends and games
- **GET** `/api/user/:steamId/game/:appId/stats` - Get game statistics and achievements
- **POST** `/api/compare` - Compare two users' game libraries
- **POST** `/api/recommendations` - Get AI-powered game recommendations
- **GET** `/api/favorites` - Get all favorite users
- **POST** `/api/favorites/:steamId` - Add user to favorites
- **DELETE** `/api/favorites/:steamId` - Remove user from favorites

## Project Structure

```
backend/
├── server.js          # Main application file
├── favorites.json     # User favorites storage
├── package.json       # Dependencies and scripts
├── .env              # Environment variables
└── api.md            # Detailed API documentation
```

## Documentation

For detailed API documentation with examples and response schemas, see [api.md](./api.md)

## License

This project is for educational and demonstration purposes.
