// Simple recommendation engine that doesn't rely on AI
function getGameRecommendations(commonGames, user1Games, user2Games) {
  // Sort common games by combined playtime
  const sortedCommon = commonGames
    .sort((a, b) => (b.user1_playtime + b.user2_playtime) - (a.user1_playtime + a.user2_playtime));
  
  // Get top played common games
  const topCommon = sortedCommon.slice(0, 5).map(game => ({
    name: game.name,
    reason: `Combined playtime: ${Math.round((game.user1_playtime + game.user2_playtime) / 60)} hours`,
    score: game.user1_playtime + game.user2_playtime
  }));
  
  // Analyze game patterns for recommendations
  const gamePatterns = analyzeGamePatterns(commonGames);
  
  // Static recommendations based on patterns
  const newGameRecommendations = getNewGameSuggestions(gamePatterns);
  
  return {
    commonGameRecommendations: topCommon.slice(0, 3),
    newGameRecommendations: newGameRecommendations
  };
}

function analyzeGamePatterns(games) {
  const patterns = {
    hasMultiplayer: false,
    hasCoop: false,
    hasStrategy: false,
    hasFPS: false,
    hasRPG: false,
    hasSurvival: false
  };
  
  games.forEach(game => {
    const name = game.name.toLowerCase();
    if (name.includes('multiplayer') || name.includes('online')) patterns.hasMultiplayer = true;
    if (name.includes('co-op') || name.includes('coop')) patterns.hasCoop = true;
    if (name.includes('strategy') || name.includes('civilization')) patterns.hasStrategy = true;
    if (name.includes('counter') || name.includes('call of')) patterns.hasFPS = true;
    if (name.includes('rpg') || name.includes('role')) patterns.hasRPG = true;
    if (name.includes('survival') || name.includes('craft')) patterns.hasSurvival = true;
  });
  
  return patterns;
}

function getNewGameSuggestions(patterns) {
  const suggestions = [];
  
  if (patterns.hasCoop || patterns.hasMultiplayer) {
    suggestions.push({
      name: "It Takes Two",
      genre: "Co-op Adventure",
      reason: "Perfect co-op game based on your multiplayer preferences"
    });
  }
  
  if (patterns.hasStrategy) {
    suggestions.push({
      name: "Divinity: Original Sin 2",
      genre: "Strategy RPG",
      reason: "Excellent co-op strategy game with deep gameplay"
    });
  }
  
  if (patterns.hasFPS) {
    suggestions.push({
      name: "Deep Rock Galactic",
      genre: "Co-op FPS",
      reason: "Team-based FPS with great co-op mechanics"
    });
  }
  
  if (patterns.hasSurvival) {
    suggestions.push({
      name: "Valheim",
      genre: "Survival",
      reason: "Popular co-op survival game with building elements"
    });
  }
  
  // Default suggestions if no patterns match
  if (suggestions.length === 0) {
    suggestions.push(
      {
        name: "Portal 2",
        genre: "Puzzle",
        reason: "Classic co-op puzzle game"
      },
      {
        name: "Terraria",
        genre: "Sandbox",
        reason: "Endless co-op possibilities"
      },
      {
        name: "Stardew Valley",
        genre: "Farming Sim",
        reason: "Relaxing co-op farming game"
      }
    );
  }
  
  return suggestions.slice(0, 3);
}

module.exports = { getGameRecommendations };