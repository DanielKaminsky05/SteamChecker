function GameCard({ game, onClick, isSelected }) {
  const hoursPlayed = Math.round(game.playtime_forever / 60);
  const recentHours = game.playtime_2weeks ? Math.round(game.playtime_2weeks / 60) : 0;

  return (
    <div
      onClick={onClick}
      className={`bg-gray-800 rounded-lg p-4 border cursor-pointer transition-all ${
        isSelected 
          ? 'border-blue-500 transform scale-105' 
          : 'border-gray-700 hover:border-gray-600'
      }`}
    >
      <div className="flex items-center gap-3">
        {game.img_icon_url && (
          <img
            src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
            alt={game.name}
            className="w-12 h-12 rounded"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{game.name}</h3>
          <p className="text-sm text-gray-400">
            {hoursPlayed} hours played
            {recentHours > 0 && (
              <span className="text-green-400"> ({recentHours}h recent)</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default GameCard;