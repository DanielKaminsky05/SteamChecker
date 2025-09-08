// ============================================================================
// STEAM USER SEARCH API SERVER
// ============================================================================
// Express.js server providing Steam user data retrieval, game library comparison,
// and AI-powered game recommendations using Steam Web API and Google Gemini AI

// ============================================================================
// DEPENDENCIES
// ============================================================================
const express = require('express');           // Web framework
const cors = require('cors');                 // Cross-origin resource sharing
const axios = require('axios');               // HTTP client for API calls
const fs = require('fs').promises;            // File system operations (async)
const path = require('path');                 // File path utilities
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Google AI SDK
require('dotenv').config();                   // Load environment variables

// ============================================================================
// SERVER SETUP
// ============================================================================
const app = express();
const PORT = process.env.PORT || 3001;        // Server port
const STEAM_API_KEY = process.env.STEAM_API_KEY; // Steam Web API key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Google Gemini API key

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Middleware setup
app.use(cors());                              // Enable CORS for frontend access
app.use(express.json());                      // Parse JSON request bodies

// ============================================================================
// DATABASE CONFIGURATION
// ============================================================================
const DB_PATH = path.join(__dirname, 'favorites.json'); // Path to favorites storage

/**
 * Initialize favorites database file
 * Creates empty JSON file if it doesn't exist
 */
async function initDB() {
  try {
    await fs.access(DB_PATH);                 // Check if file exists
  } catch {
    await fs.writeFile(DB_PATH, JSON.stringify({})); // Create empty file
  }
}

/**
 * Read favorites from JSON file
 * @returns {Object} Favorites object or empty object on error
 */
async function readFavorites() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {};                                // Return empty object on any error
  }
}

/**
 * Write favorites to JSON file
 * @param {Object} favorites - Favorites data to save
 */
async function writeFavorites(favorites) {
  await fs.writeFile(DB_PATH, JSON.stringify(favorites, null, 2));
}

// ============================================================================
// STEAM ID UTILITIES
// ============================================================================

/**
 * Convert Steam ID to 64-bit format
 * Currently only validates 17-digit Steam IDs
 * @param {string} input - Steam ID to validate
 * @returns {string|null} Valid Steam ID or null
 */
function convertToSteamID64(input) {
  if (/^\d{17}$/.test(input)) {               // Check for 17-digit format
    return input;
  }
  return null;
}

// ============================================================================
// STEAM API FUNCTIONS
// ============================================================================

/**
 * Get Steam user profile data
 * @param {string} steamId - 17-digit Steam ID
 * @returns {Object|null} User data or null if not found
 */
async function getSteamUserData(steamId) {
  try {
    const response = await axios.get(
      `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${steamId}`
    );
    
    if (response.data.response.players.length > 0) {
      const player = response.data.response.players[0];
      // Transform Steam API response to consistent format
      return {
        steamId: player.steamid,
        personaName: player.personaname,
        profileUrl: player.profileurl,
        avatar: player.avatar,                // 32x32 avatar
        avatarMedium: player.avatarmedium,    // 64x64 avatar
        avatarFull: player.avatarfull,        // 184x184 avatar
        personaState: player.personastate,    // Online status
        lastLogOff: player.lastlogoff,        // Last logoff timestamp
        realName: player.realname || null,
        primaryClanId: player.primaryclanid || null,
        timeCreated: player.timecreated || null,
        personaStateFlags: player.personastateflags || null,
        locCountryCode: player.loccountrycode || null,
        gameId: player.gameid || null,        // Current game if playing
        gameExtraInfo: player.gameextrainfo || null, // Current game name
        communityVisibilityState: player.communityvisibilitystate || null,
        timestamp: Date.now()                 // Cache timestamp
      };
    }
    return null;
  } catch (error) {
    console.error('Steam API error:', error);
    throw error;
  }
}

/**
 * Get user's Steam friends list
 * @param {string} steamId - 17-digit Steam ID
 * @returns {Array} Array of friend profile objects
 */
async function getUserFriends(steamId) {
  try {
    // Get friends list from Steam API
    const response = await axios.get(
      `http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&relationship=friend`
    );
    
    if (response.data.friendslist) {
      // Extract friend IDs and join for batch request
      const friendIds = response.data.friendslist.friends.map(f => f.steamid).join(',');
      
      // TODO: This doesn't handle 100+ friends properly (Steam API limit)
      // Get detailed friend profile data
      const friendsResponse = await axios.get(
        `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_API_KEY}&steamids=${friendIds}`
      );
      
      return friendsResponse.data.response.players;
    }
    return [];
  } catch (error) {
    // TODO: Handle 401 errors (private profiles) more gracefully
    console.error('Friends API error:', error);
    return [];                                // Return empty array on error
  }
}

/**
 * Get user's owned games library
 * @param {string} steamId - 17-digit Steam ID
 * @returns {Array} Array of game objects with playtime data
 */
async function getUserGames(steamId) {
  try {
    const response = await axios.get(
      `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&format=json&include_appinfo=true&include_played_free_games=true`
    );
    
    if (response.data.response.games) {
      return response.data.response.games;
    }
    return [];
  } catch (error) {
    console.error('Games API error:', error);
    return [];
  }
}

/**
 * Get user statistics for a specific game
 * @param {string} steamId - 17-digit Steam ID
 * @param {string} appId - Steam application ID
 * @returns {Object|null} Game stats or null if unavailable
 */
async function getUserGameStats(steamId, appId) {
  try {
    const response = await axios.get(
      `http://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v0002/?appid=${appId}&key=${STEAM_API_KEY}&steamid=${steamId}`
    );
    
    return response.data.playerstats || null;
  } catch (error) {
    return null;                              // Return null for games without stats
  }
}

/**
 * Get user achievements for a game with schema data (includes images)
 * @param {string} steamId - 17-digit Steam ID
 * @param {string} appId - Steam application ID
 * @returns {Object|null} Achievement data with images or null
 */
async function getUserAchievements(steamId, appId) {
  try {
    // Make parallel requests for achievements and schema
    const [userAchievements, gameSchema] = await Promise.all([
      axios.get(
        `http://api.steampowered.com/ISteamUserStats/GetPlayerAchievements/v0001/?appid=${appId}&key=${STEAM_API_KEY}&steamid=${steamId}`
      ),
      axios.get(
        `http://api.steampowered.com/ISteamUserStats/GetSchemaForGame/v2/?key=${STEAM_API_KEY}&appid=${appId}`
      )
    ]);
    
    const achievements = userAchievements.data.playerstats?.achievements || [];
    const schema = gameSchema.data.game?.availableGameStats?.achievements || [];
    
    // Merge user achievement data with schema for complete info
    const mergedAchievements = achievements.map(achievement => {
      const schemaData = schema.find(s => s.name === achievement.apiname);
      return {
        ...achievement,
        displayName: schemaData?.displayName || achievement.apiname,
        description: schemaData?.description || '',
        icon: schemaData?.icon || '',         // Achievement icon URL
        icongray: schemaData?.icongray || ''  // Grayed icon for locked achievements
      };
    });
    
    return {
      gameName: userAchievements.data.playerstats?.gameName,
      achievements: mergedAchievements
    };
  } catch (error) {
    return null;
  }
}

/**
 * Resolve Steam vanity URL to Steam ID
 * @param {string} vanityUrl - Vanity URL (e.g., 'gaben')
 * @returns {string|null} Steam ID or null if not found
 */
async function resolveVanityURL(vanityUrl) {
  try {
    const response = await axios.get(
      `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${vanityUrl}`
    );
    
    if (response.data.response.success === 1) {
      return response.data.response.steamid;
    }
    return null;
  } catch (error) {
    console.error('Vanity URL resolution error:', error);
    return null;
  }
}

// ============================================================================
// API ROUTES
// ============================================================================

/**
 * Search for Steam user by Steam ID or vanity URL
 * GET /api/search/:query
 */
app.get('/api/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    let steamId = convertToSteamID64(query);  // Try Steam ID format first
    
    if (!steamId) {
      // If not a Steam ID, try resolving as vanity URL
      steamId = await resolveVanityURL(query);
      if (!steamId) {
        return res.status(404).json({ error: 'User not found' });
      }
    }
    
    // Get user data with resolved Steam ID
    const userData = await getSteamUserData(steamId);
    if (userData) {
      res.json(userData);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Get detailed user info including friends and games
 * GET /api/user/:steamId/details
 */
app.get('/api/user/:steamId/details', async (req, res) => {
  try {
    const { steamId } = req.params;
    
    // Make parallel requests for efficiency
    const [userData, friends, games] = await Promise.all([
      getSteamUserData(steamId),
      getUserFriends(steamId),              // May return empty for private profiles
      getUserGames(steamId)
    ]);
    
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: userData,
      friends: friends,
      games: games,
      totalGames: games.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Get game statistics and achievements for a user
 * GET /api/user/:steamId/game/:appId/stats
 */
app.get('/api/user/:steamId/game/:appId/stats', async (req, res) => {
  try {
    const { steamId, appId } = req.params;
    
    // Get stats and achievements in parallel
    const [stats, achievements] = await Promise.all([
      getUserGameStats(steamId, appId),
      getUserAchievements(steamId, appId)
    ]);
    
    res.json({
      stats: stats,
      achievements: achievements
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Compare two users' game libraries
 * POST /api/compare
 */
app.post('/api/compare', async (req, res) => {
  try {
    const { steamId1, steamId2 } = req.body;
    
    // Get data for both users in parallel
    const [user1Data, user2Data, user1Games, user2Games] = await Promise.all([
      getSteamUserData(steamId1),
      getSteamUserData(steamId2),
      getUserGames(steamId1),
      getUserGames(steamId2)
    ]);
    
    if (!user1Data || !user2Data) {
      return res.status(404).json({ error: 'One or both users not found' });
    }
    
    // Find common games using Set for efficient lookup
    const user1GameIds = new Set(user1Games.map(g => g.appid));
    const commonGames = user2Games.filter(game => user1GameIds.has(game.appid));
    
    // Create detailed comparison data for common games
    const commonGamesDetailed = commonGames.map(game => {
      const user1Game = user1Games.find(g => g.appid === game.appid);
      return {
        appid: game.appid,
        name: game.name,
        img_icon_url: game.img_icon_url,
        user1_playtime: user1Game.playtime_forever,
        user2_playtime: game.playtime_forever,
        user1_playtime_2weeks: user1Game.playtime_2weeks || 0,
        user2_playtime_2weeks: game.playtime_2weeks || 0
      };
    });
    
    res.json({
      user1: user1Data,
      user2: user2Data,
      user1Games: user1Games,
      user2Games: user2Games,
      commonGames: commonGamesDetailed,
      commonGamesCount: commonGames.length
    });
  } catch (error) {
    console.error('Compare error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Generate AI-powered game recommendations
 * POST /api/recommendations
 */
app.post('/api/recommendations', async (req, res) => {
  try {
    const { user1, user2, commonGames } = req.body;
    
    // Optimize data for AI prompt to reduce token usage
    const topCommon = commonGames
      .sort((a, b) => (b.user1_playtime + b.user2_playtime) - (a.user1_playtime + a.user2_playtime))
      .slice(0, 5)                          // Top 5 most played games
      .map(g => g.name);
    
    // Simple genre detection based on game names
    const genres = new Set();
    commonGames.slice(0, 10).forEach(game => {
      // Basic keyword matching for genre classification
      if (game.name.toLowerCase().includes('rpg') || game.name.toLowerCase().includes('role')) genres.add('RPG');
      if (game.name.toLowerCase().includes('strategy') || game.name.toLowerCase().includes('civilization')) genres.add('Strategy');
      if (game.name.toLowerCase().includes('shooter') || game.name.toLowerCase().includes('counter')) genres.add('FPS');
      if (game.name.toLowerCase().includes('survival') || game.name.toLowerCase().includes('craft')) genres.add('Survival');
    });
    
    // Create concise AI prompt
    const prompt = `Two Steam users want game recommendations.
    
Common games they own: ${topCommon.join(', ')}
Total shared games: ${commonGames.length}

Suggest:
1. Top 3 games from their library to play together
2. 3 new games they should buy

Return ONLY JSON:
{
  "commonGameRecommendations": [
    {"name": "Game Name", "reason": "Brief reason"}
  ],
  "newGameRecommendations": [
    {"name": "Game Name", "genre": "Genre", "reason": "Brief reason"}
  ]
}`;
    
    // Generate AI recommendations
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract JSON from AI response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const recommendations = JSON.parse(jsonMatch[0]);
        res.json(recommendations);
      } else {
        // Fallback if AI doesn't return proper JSON
        res.json({
          commonGameRecommendations: topCommon.slice(0, 3).map(name => ({
            name,
            reason: "You both have significant playtime in this game"
          })),
          newGameRecommendations: [
            { name: "It Takes Two", genre: "Co-op", reason: "Perfect for two players" },
            { name: "Portal 2", genre: "Puzzle", reason: "Great co-op campaign" },
            { name: "Terraria", genre: "Sandbox", reason: "Endless co-op possibilities" }
          ]
        });
      }
    } catch (parseError) {
      // JSON parsing fallback
      res.json({
        commonGameRecommendations: topCommon.slice(0, 3).map(name => ({
          name,
          reason: "You both have significant playtime in this game"
        })),
        newGameRecommendations: [
          { name: "It Takes Two", genre: "Co-op", reason: "Perfect for two players" },
          { name: "Portal 2", genre: "Puzzle", reason: "Great co-op campaign" },
          { name: "Terraria", genre: "Sandbox", reason: "Endless co-op possibilities" }
        ]
      });
    }
  } catch (error) {
    console.error('AI recommendation error:', error);
    
    // Complete fallback system when AI fails
    const { commonGames } = req.body;
    const topCommon = commonGames
      .sort((a, b) => (b.user1_playtime + b.user2_playtime) - (a.user1_playtime + a.user2_playtime))
      .slice(0, 3);
    
    res.json({
      commonGameRecommendations: topCommon.map(game => ({
        name: game.name,
        reason: "You both have significant playtime in this game"
      })),
      newGameRecommendations: [
        { name: "It Takes Two", genre: "Co-op", reason: "Perfect for two players" },
        { name: "Portal 2", genre: "Puzzle", reason: "Great co-op campaign" },
        { name: "Terraria", genre: "Sandbox", reason: "Endless co-op possibilities" }
      ],
      fallback: true
    });
  }
});

// ============================================================================
// FAVORITES MANAGEMENT ROUTES
// ============================================================================

/**
 * Get all favorite users with auto-refresh
 * GET /api/favorites
 */
app.get('/api/favorites', async (req, res) => {
  try {
    const favorites = await readFavorites();
    const now = Date.now();
    const FIVE_MINUTES = 5 * 60 * 1000;      // 5 minutes in milliseconds
    
    // Refresh stale user data
    for (const steamId in favorites) {
      if (now - favorites[steamId].timestamp > FIVE_MINUTES) {
        const freshData = await getSteamUserData(steamId);
        if (freshData) {
          favorites[steamId] = freshData;
        }
      }
    }
    
    await writeFavorites(favorites);
    res.json(Object.values(favorites));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Add user to favorites
 * POST /api/favorites/:steamId
 */
app.post('/api/favorites/:steamId', async (req, res) => {
  try {
    const { steamId } = req.params;
    const userData = await getSteamUserData(steamId);
    
    if (userData) {
      const favorites = await readFavorites();
      favorites[steamId] = userData;
      await writeFavorites(favorites);
      res.json(userData);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * Remove user from favorites
 * DELETE /api/favorites/:steamId
 */
app.delete('/api/favorites/:steamId', async (req, res) => {
  try {
    const { steamId } = req.params;
    const favorites = await readFavorites();
    delete favorites[steamId];
    await writeFavorites(favorites);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ============================================================================
// SERVER INITIALIZATION
// ============================================================================

/**
 * Initialize database and start server
 * Creates favorites.json if it doesn't exist, then starts listening
 */
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});