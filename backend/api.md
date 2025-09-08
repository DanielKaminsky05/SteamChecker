# Steam User Search API

A comprehensive Node.js Express API that provides Steam user data retrieval, game library comparison, and AI-powered game recommendations using the Steam Web API and Google's Gemini AI.

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

### 🔍 User Search
```http
GET /api/search/:query
```
Search for a Steam user by Steam ID or vanity URL.

**Parameters:**
- `query` (string): Steam ID (17 digits) or vanity URL name

**Example:**
```bash
curl http://localhost:3001/api/search/gaben
curl http://localhost:3001/api/search/76561197960287930
```

**Response:**
```json
{
  "steamId": "76561197960287930",
  "personaName": "Gabe Newell",
  "profileUrl": "https://steamcommunity.com/id/gaben/",
  "avatar": "https://avatars.steamstatic.com/avatar_small.jpg",
  "avatarMedium": "https://avatars.steamstatic.com/avatar_medium.jpg",
  "avatarFull": "https://avatars.steamstatic.com/avatar_full.jpg",
  "personaState": 1,
  "lastLogOff": 1640995200,
  "realName": "Gabe Newell",
  "primaryClanId": "103582791429521412",
  "timeCreated": 1063407589,
  "personaStateFlags": 0,
  "locCountryCode": "US",
  "gameId": null,
  "gameExtraInfo": null,
  "communityVisibilityState": 3,
  "timestamp": 1720627200000
}
```

### 👤 User Details
```http
GET /api/user/:steamId/details
```
Get comprehensive user information including friends and games.

**Parameters:**
- `steamId` (string): 17-digit Steam ID

**Example:**
```bash
curl http://localhost:3001/api/user/76561197960287930/details
```

**Response:**
```json
{
  "user": {
    "steamId": "76561197960287930",
    "personaName": "Gabe Newell",
    "profileUrl": "https://steamcommunity.com/id/gaben/",
    "avatar": "https://avatars.steamstatic.com/avatar_small.jpg",
    "avatarMedium": "https://avatars.steamstatic.com/avatar_medium.jpg",
    "avatarFull": "https://avatars.steamstatic.com/avatar_full.jpg",
    "personaState": 1,
    "lastLogOff": 1640995200,
    "realName": "Gabe Newell",
    "primaryClanId": "103582791429521412",
    "timeCreated": 1063407589,
    "personaStateFlags": 0,
    "locCountryCode": "US",
    "gameId": null,
    "gameExtraInfo": null,
    "communityVisibilityState": 3,
    "timestamp": 1720627200000
  },
  "friends": [
    {
      "steamid": "76561198098480885",
      "communityvisibilitystate": 3,
      "profilestate": 1,
      "personaname": "WardenOfDarkness",
      "profileurl": "https://steamcommunity.com/profiles/76561198098480885/",
      "avatar": "https://avatars.steamstatic.com/3f459b709cec1fc62d01a7d0ee025145d60a2d8c.jpg",
      "avatarmedium": "https://avatars.steamstatic.com/3f459b709cec1fc62d01a7d0ee025145d60a2d8c_medium.jpg",
      "avatarfull": "https://avatars.steamstatic.com/3f459b709cec1fc62d01a7d0ee025145d60a2d8c_full.jpg",
      "avatarhash": "3f459b709cec1fc62d01a7d0ee025145d60a2d8c",
      "personastate": 0,
      "realname": "zach",
      "primaryclanid": "103582791437091729",
      "timecreated": 1374106512,
      "personastateflags": 0,
      "loccountrycode": "US",
      "locstatecode": "WI",
      "lastlogoff": 1640995200
    }
  ],
  "games": [
    {
      "appid": 730,
      "name": "Counter-Strike 2",
      "playtime_forever": 94048,
      "img_icon_url": "8dbc71957312bbd3baea65848b545be9eae2a355",
      "has_community_visible_stats": true,
      "content_descriptorids": [
        2,
        5
      ]
    }
  ],
  "totalGames": 150
}
```

### 📊 Game Statistics
```http
GET /api/user/:steamId/game/:appId/stats
```
Get detailed statistics and achievements for a specific game.

**Parameters:**
- `steamId` (string): 17-digit Steam ID
- `appId` (number): Steam application ID

**Example:**
```bash
curl http://localhost:3001/api/user/76561197960287930/game/730/stats
```

**Response:**
```json
{
  "stats": {
    "steamID": "76561197960287930",
    "gameName": "Counter-Strike 2",
    "stats": [
      {
        "name": "total_kills",
        "value": 12500
      },
      {
        "name": "total_deaths",
        "value": 8000
      }
    ],
    "achievements": [
      {
        "name": "WIN_PISTOLROUND",
        "achieved": 1
      }
    ]
  },
  "achievements": {
    "steamID": "76561197960287930",
    "gameName": "Counter-Strike 2",
    "achievements": [
      {
        "apiname": "WIN_PISTOLROUND",
        "achieved": 1,
        "unlocktime": 1640995200,
        "displayName": "Pistol Round Winner",
        "description": "Win a pistol round",
        "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/730/achievement_icon.jpg",
        "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/730/achievement_icon_gray.jpg"
      }
    ]
  }
}
```

### ⚖️ Compare Users
```http
POST /api/compare
```
Compare game libraries between two Steam users.

**Request Body:**
```json
{
  "steamId1": "76561197960287930",
  "steamId2": "76561198063699509"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/compare \
  -H "Content-Type: application/json" \
  -d '{"steamId1":"76561197960287930","steamId2":"76561198063699509"}'
```

**Response:**
```json
{
  "user1": {
    "steamId": "76561197960287930",
    "personaName": "User One",
    "profileUrl": "https://steamcommunity.com/id/user1/",
    "avatar": "https://avatars.steamstatic.com/avatar_small.jpg",
    "avatarMedium": "https://avatars.steamstatic.com/avatar_medium.jpg",
    "avatarFull": "https://avatars.steamstatic.com/avatar_full.jpg",
    "personaState": 1,
    "lastLogOff": 1640995200,
    "realName": "User One",
    "primaryClanId": null,
    "timeCreated": 1063407589,
    "personaStateFlags": 0,
    "locCountryCode": "US",
    "gameId": null,
    "gameExtraInfo": null,
    "communityVisibilityState": 3,
    "timestamp": 1720627200000
  },
  "user2": {
    "steamId": "76561198063699509",
    "personaName": "User Two",
    "profileUrl": "https://steamcommunity.com/id/user2/",
    "avatar": "https://avatars.steamstatic.com/avatar_small.jpg",
    "avatarMedium": "https://avatars.steamstatic.com/avatar_medium.jpg",
    "avatarFull": "https://avatars.steamstatic.com/avatar_full.jpg",
    "personaState": 0,
    "lastLogOff": 1640995200,
    "realName": null,
    "primaryClanId": null,
    "timeCreated": 1334764800,
    "personaStateFlags": 0,
    "locCountryCode": "CA",
    "gameId": null,
    "gameExtraInfo": null,
    "communityVisibilityState": 3,
    "timestamp": 1720627200000
  },
  "user1Games": [
    {
      "appid": 730,
      "name": "Counter-Strike 2",
      "playtime_forever": 94048,
      "img_icon_url": "8dbc71957312bbd3baea65848b545be9eae2a355",
      "has_community_visible_stats": true,
      "content_descriptorids": [2, 5]
    }
  ],
  "user2Games": [
    {
      "appid": 730,
      "name": "Counter-Strike 2",
      "playtime_forever": 45200,
      "img_icon_url": "8dbc71957312bbd3baea65848b545be9eae2a355",
      "has_community_visible_stats": true,
      "content_descriptorids": [2, 5]
    }
  ],
  "commonGames": [
    {
      "appid": 730,
      "name": "Counter-Strike 2",
      "img_icon_url": "8dbc71957312bbd3baea65848b545be9eae2a355",
      "user1_playtime": 94048,
      "user2_playtime": 45200,
      "user1_playtime_2weeks": 0,
      "user2_playtime_2weeks": 0
    }
  ],
  "commonGamesCount": 25
}
```

### 🤖 AI Recommendations
```http
POST /api/recommendations
```
Get AI-powered game recommendations based on user comparison data using Google Gemini.

**Request Body:**
```json
{
  "user1": { /* Complete user1 data object */ },
  "user2": { /* Complete user2 data object */ },
  "commonGames": [ /* Array of common games */ ]
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/recommendations \
  -H "Content-Type: application/json" \
  -d @comparison_data.json
```

**Response:**
```json
{
  "commonGameRecommendations": [
    {
      "name": "Counter-Strike 2",
      "reason": "Both players have significant playtime and recent activity"
    },
    {
      "name": "Dota 2",
      "reason": "Popular among competitive players like yourselves"
    }
  ],
  "newGameRecommendations": [
    {
      "name": "It Takes Two",
      "genre": "Co-op",
      "reason": "Perfect cooperative experience for two players"
    },
    {
      "name": "Portal 2",
      "genre": "Puzzle",
      "reason": "Excellent co-op campaign with great puzzle mechanics"
    }
  ]
}
```

### ⭐ Favorites Management

#### Get All Favorites
```http
GET /api/favorites
```
Retrieve all saved favorite users with auto-refreshed data.

**Response:**
```json
[
  {
    "steamId": "76561197960287930",
    "personaName": "Gabe Newell",
    "profileUrl": "https://steamcommunity.com/id/gaben/",
    "avatar": "https://avatars.steamstatic.com/avatar_small.jpg",
    "avatarMedium": "https://avatars.steamstatic.com/avatar_medium.jpg",
    "avatarFull": "https://avatars.steamstatic.com/avatar_full.jpg",
    "personaState": 1,
    "lastLogOff": 1640995200,
    "realName": "Gabe Newell",
    "primaryClanId": "103582791429521412",
    "timeCreated": 1063407589,
    "personaStateFlags": 0,
    "locCountryCode": "US",
    "gameId": null,
    "gameExtraInfo": null,
    "communityVisibilityState": 3,
    "timestamp": 1720627200000
  }
]
```

#### Add Favorite
```http
POST /api/favorites/:steamId
```
Add a user to favorites list.

**Example:**
```bash
curl -X POST http://localhost:3001/api/favorites/76561197960287930
```

**Response:**
```json
{
  "steamId": "76561197960287930",
  "personaName": "Gabe Newell",
  "profileUrl": "https://steamcommunity.com/id/gaben/",
  "avatar": "https://avatars.steamstatic.com/avatar_small.jpg",
  "avatarMedium": "https://avatars.steamstatic.com/avatar_medium.jpg",
  "avatarFull": "https://avatars.steamstatic.com/avatar_full.jpg",
  "personaState": 1,
  "lastLogOff": 1640995200,
  "realName": "Gabe Newell",
  "primaryClanId": "103582791429521412",
  "timeCreated": 1063407589,
  "personaStateFlags": 0,
  "locCountryCode": "US",
  "gameId": null,
  "gameExtraInfo": null,
  "communityVisibilityState": 3,
  "timestamp": 1720627200000
}
```

#### Remove Favorite
```http
DELETE /api/favorites/:steamId
```
Remove a user from favorites list.

**Example:**
```bash
curl -X DELETE http://localhost:3001/api/favorites/76561197960287930
```

**Response:**
```json
{
  "success": true
}
```

## Data Structure Reference

### User Data Fields

All user objects returned by the API contain the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `steamId` | string | 17-digit Steam ID |
| `personaName` | string | Display name on Steam |
| `profileUrl` | string | Steam profile URL |
| `avatar` | string | Small avatar image URL (32x32) |
| `avatarMedium` | string | Medium avatar image URL (64x64) |
| `avatarFull` | string | Full avatar image URL (184x184) |
| `personaState` | number | Online status (0=Offline, 1=Online, 2=Busy, 3=Away, 4=Snooze, 5=Looking to trade, 6=Looking to play) |
| `lastLogOff` | number | Unix timestamp of last logoff |
| `realName` | string\|null | Real name if public |
| `primaryClanId` | string\|null | Primary Steam group ID |
| `timeCreated` | number\|null | Unix timestamp of account creation |
| `personaStateFlags` | number\|null | Additional persona state flags |
| `locCountryCode` | string\|null | Country code (ISO 3166-1 alpha-2) |
| `gameId` | string\|null | Current game ID if playing |
| `gameExtraInfo` | string\|null | Current game name if playing |
| `communityVisibilityState` | number\|null | Profile visibility (1=Private, 2=Friends only, 3=Public) |
| `timestamp` | number | API response timestamp |

### Friends Data Fields

Friends objects contain the following fields (raw Steam API format):

| Field | Type | Description |
|-------|------|-------------|
| `steamid` | string | 17-digit Steam ID |
| `communityvisibilitystate` | number | Profile visibility (1=Private, 2=Friends only, 3=Public) |
| `profilestate` | number | Profile state (1=Configured, 0=Not configured) |
| `personaname` | string | Display name on Steam |
| `profileurl` | string | Steam profile URL |
| `avatar` | string | Small avatar image URL (32x32) |
| `avatarmedium` | string | Medium avatar image URL (64x64) |
| `avatarfull` | string | Full avatar image URL (184x184) |
| `avatarhash` | string | Hash identifier for avatar images |
| `personastate` | number | Online status (0=Offline, 1=Online, 2=Busy, 3=Away, 4=Snooze, 5=Looking to trade, 6=Looking to play) |
| `realname` | string\|undefined | Real name if public |
| `primaryclanid` | string\|undefined | Primary Steam group ID |
| `timecreated` | number\|undefined | Unix timestamp of account creation |
| `personastateflags` | number | Additional persona state flags |
| `loccountrycode` | string\|undefined | Country code (ISO 3166-1 alpha-2) |
| `locstatecode` | string\|undefined | State/province code (US states, Canadian provinces, etc.) |
| `lastlogoff` | number\|undefined | Unix timestamp of last logoff |

### Games Data Fields

Games objects contain the following fields:

| Field | Type | Description |
|-------|------|-------------|
| `appid` | number | Steam application ID |
| `name` | string | Game title |
| `playtime_forever` | number | Total playtime in minutes |
| `img_icon_url` | string | Game icon hash (use with Steam CDN) |
| `has_community_visible_stats` | boolean | Whether the game has public statistics |
| `content_descriptorids` | array | Content descriptor IDs for game content warnings |
| `img_logo_url` | string | Game logo hash (optional) |
| `playtime_windows_forever` | number | Windows playtime in minutes (optional) |
| `playtime_mac_forever` | number | Mac playtime in minutes (optional) |
| `playtime_linux_forever` | number | Linux playtime in minutes (optional) |
| `playtime_2weeks` | number | Recent 2-week playtime in minutes (optional) |
| `playtime_disconnected` | number | Offline playtime in minutes (optional) |

**Note:** The `img_icon_url` field contains only the hash. To display the actual icon, construct the full URL as:
```
https://media.steampowered.com/steamcommunity/public/images/apps/{appid}/{img_icon_url}.jpg
```

**Content Descriptor IDs:**
- `1`: Some Nudity or Sexual Content
- `2`: Frequent Violence or Gore
- `3`: Adult Only Sexual Content
- `4`: Frequent Nudity or Sexual Content
- `5`: General Mature Content

## Dependencies

```json
{
  "express": "^5.1.0",
  "cors": "^2.8.5",
  "axios": "^1.10.0",
  "dotenv": "^17.0.1",
  "@google/generative-ai": "^0.24.1"
}
```

## Error Handling

The API includes comprehensive error handling with appropriate HTTP status codes:

- **404 Not Found**: User not found or invalid Steam ID
- **500 Internal Server Error**: Steam API issues, network problems, or server errors

All endpoints return errors in the following format:
```json
{
  "error": "Error description"
}
```

## Data Storage

- **Favorites**: Stored in `favorites.json` with automatic refresh every 5 minutes
- **Cache**: User data is timestamped and refreshed to maintain current status
- **Persistence**: File-based storage for simplicity and reliability

## Steam Web API Integration

The backend integrates with multiple Steam Web API endpoints:

- `ISteamUser/GetPlayerSummaries` - User profile data
- `ISteamUser/GetFriendList` - Friends list retrieval
- `ISteamUser/ResolveVanityURL` - Convert vanity URLs to Steam IDs
- `IPlayerService/GetOwnedGames` - Game library data
- `ISteamUserStats/GetUserStatsForGame` - Game-specific statistics
- `ISteamUserStats/GetPlayerAchievements` - Achievement data
- `ISteamUserStats/GetSchemaForGame` - Achievement schema with images

## AI Integration

Uses Google's Gemini AI for intelligent game recommendations:
- Analyzes common games and playtime patterns
- Provides personalized suggestions for shared gaming
- Includes fallback recommendations if AI service is unavailable
- Optimized prompts to reduce API usage and improve response quality

## Rate Limits

- **Steam API**: 100,000 calls per day per API key
- **Google Gemini**: Varies by plan (check your quota)
- **Built-in caching**: Reduces API calls through data persistence

## Security Considerations

- Never expose API keys in client-side code
- Use environment variables for sensitive configuration
- CORS is enabled for frontend integration
- No authentication required (suitable for demo/development)

## Troubleshooting

### Common Issues

1. **"User not found" errors**
   - Verify Steam ID format (17 digits)
   - Check if profile is public
   - Ensure vanity URL is correct

2. **Steam API errors**
   - Verify API key is valid and active
   - Check Steam API status
   - Ensure rate limits aren't exceeded

3. **AI recommendation failures**
   - Check Gemini API key and quota
   - Fallback recommendations will be provided
   - Monitor console for detailed error logs

### Debug Mode
Enable detailed logging by setting:
```env
NODE_ENV=development
```

## License

This project is for educational and demonstration purposes.