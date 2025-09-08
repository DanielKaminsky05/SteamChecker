function ComparisonResult({ comparison }) {
  const { user1, user2, commonGames, user1Games, user2Games } = comparison;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4">Comparison Summary</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">{user1Games.length}</p>
            <p className="text-gray-400">{user1.personaName}'s Games</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">{commonGames.length}</p>
            <p className="text-gray-400">Games in Common</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-400">{user2Games.length}</p>
            <p className="text-gray-400">{user2.personaName}'s Games</p>
          </div>
        </div>
      </div>

      {/* Common Games */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-4">Common Games ({commonGames.length})</h3>
        {commonGames.length > 0 ? (
          <div className="grid gap-4">
            {commonGames
              .sort((a, b) => (b.user1_playtime + b.user2_playtime) - (a.user1_playtime + a.user2_playtime))
              .map(game => (
                <div key={game.appid} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {game.img_icon_url && (
                        <img
                          src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                          alt={game.name}
                          className="w-12 h-12 rounded"
                        />
                      )}
                      <h4 className="font-semibold">{game.name}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {user1.personaName}: {Math.round(game.user1_playtime / 60)}h
                      </p>
                      <p className="text-sm text-gray-400">
                        {user2.personaName}: {Math.round(game.user2_playtime / 60)}h
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-400">No games in common</p>
        )}
      </div>
    </div>
  );
}

export default ComparisonResult;