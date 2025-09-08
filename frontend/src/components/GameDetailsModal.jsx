import { useState } from 'react';

function GameDetailsModal({ game, stats, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 pb-0">
          <h2 className="text-2xl font-bold">{game.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4">
          <div className="flex gap-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-4 transition-colors ${
                activeTab === 'overview' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`pb-2 px-4 transition-colors ${
                activeTab === 'stats' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Statistics
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`pb-2 px-4 transition-colors ${
                activeTab === 'achievements' 
                  ? 'text-blue-400 border-b-2 border-blue-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Achievements
            </button>
          </div>
        </div>

        {/* Content with proper padding and scrolling */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Total Playtime</p>
                  <p className="text-xl font-semibold">
                    {Math.round(game.playtime_forever / 60)} hours
                  </p>
                </div>
                {game.playtime_2weeks > 0 && (
                  <div>
                    <p className="text-gray-400">Last 2 weeks</p>
                    <p className="text-xl font-semibold">
                      {Math.round(game.playtime_2weeks / 60)} hours
                    </p>
                  </div>
                )}
              </div>
              
              {stats?.achievements && (
                <div>
                  <p className="text-gray-400">Achievement Progress</p>
                  <div className="mt-2">
                    <div className="flex justify-between mb-1">
                      <span>
                        {stats.achievements.achievements?.filter(a => a.achieved).length || 0} / {stats.achievements.achievements?.length || 0}
                      </span>
                      <span>
                        {Math.round((stats.achievements.achievements?.filter(a => a.achieved).length / stats.achievements.achievements?.length) * 100) || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(stats.achievements.achievements?.filter(a => a.achieved).length / stats.achievements.achievements?.length) * 100 || 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats Summary */}
              {stats?.stats?.stats && stats.stats.stats.length > 0 && (
                <div>
                  <p className="text-gray-400 mb-2">Quick Stats</p>
                  <div className="grid grid-cols-2 gap-2">
                    {stats.stats.stats.slice(0, 4).map((stat, index) => (
                      <div key={index} className="bg-gray-700 rounded p-2">
                        <p className="text-xs text-gray-400 truncate">{stat.name}</p>
                        <p className="font-semibold">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  {stats.stats.stats.length > 4 && (
                    <p className="text-sm text-gray-400 mt-2">
                      View all {stats.stats.stats.length} stats in the Statistics tab
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="pr-2"> {/* Add padding-right to account for scrollbar */}
              {stats?.stats?.stats && stats.stats.stats.length > 0 ? (
                <div className="space-y-1">
                  <div className="mb-2 text-sm text-gray-400">
                    Total Statistics: {stats.stats.stats.length}
                  </div>
                  {stats.stats.stats.map((stat, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center py-2 px-2 hover:bg-gray-700 rounded transition-colors"
                    >
                      <span className="text-gray-300 break-words flex-1 mr-4">
                        {stat.name}
                      </span>
                      <span className="font-semibold text-blue-400 flex-shrink-0">
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No statistics available for this game</p>
                  <p className="text-sm text-gray-500 mt-2">
                    The game may not track statistics or they may be private
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="pr-2"> {/* Add padding-right to account for scrollbar */}
              {stats?.achievements?.achievements && stats.achievements.achievements.length > 0 ? (
                <div className="space-y-3">
                  <div className="mb-2 text-sm text-gray-400">
                    Unlocked: {stats.achievements.achievements.filter(a => a.achieved).length} / {stats.achievements.achievements.length}
                  </div>
                  {stats.achievements.achievements
                    .sort((a, b) => b.achieved - a.achieved)
                    .map((achievement, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                          achievement.achieved 
                            ? 'bg-gray-700 hover:bg-gray-600' 
                            : 'bg-gray-700/30 opacity-60'
                        }`}
                      >
                        {(achievement.icon || achievement.icongray) && (
                          <img
                            src={achievement.achieved ? achievement.icon : achievement.icongray}
                            alt={achievement.displayName}
                            className="w-14 h-14 rounded flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm">
                            {achievement.displayName || achievement.apiname}
                          </h4>
                          {achievement.description && (
                            <p className="text-xs text-gray-400 mt-1">
                              {achievement.description}
                            </p>
                          )}
                          {achievement.achieved === 1 && (
                            <p className="text-xs text-green-400 mt-1">
                              ✓ Unlocked
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-400">No achievements available for this game</p>
                  <p className="text-sm text-gray-500 mt-2">
                    The game may not have achievements or they may be private
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameDetailsModal;