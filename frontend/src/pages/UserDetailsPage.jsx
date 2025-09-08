import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import GameCard from '../components/GameCard';
import FriendCard from '../components/FriendCard';
import GameDetailsModal from '../components/GameDetailsModal';

const API_BASE_URL = 'http://localhost:3001/api';

function UserDetailsPage() {
  const { steamId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('games');
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameStats, setGameStats] = useState({});
  const [sortBy, setSortBy] = useState('playtime');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchUserDetails();
  }, [steamId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/${steamId}/details`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGameStats = async (appId) => {
    if (gameStats[appId]) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/user/${steamId}/game/${appId}/stats`);
      setGameStats(prev => ({
        ...prev,
        [appId]: response.data
      }));
    } catch (error) {
      console.error('Error fetching game stats:', error);
    }
  };

  const sortGames = (games) => {
    const sorted = [...games].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === 'asc'
          ? a.playtime_forever - b.playtime_forever
          : b.playtime_forever - a.playtime_forever;
      }
    });
    return sorted;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-400">User not found</p>
      </div>
    );
  }

  const { user, friends, games } = userData;
  const sortedGames = sortGames(games);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-blue-400 hover:text-blue-300 mb-4 inline-block">
        ← Back to Search
      </Link>

      {/* User Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex items-center gap-6">
          <img 
            src={user.avatarFull} 
            alt={user.personaName}
            className="w-32 h-32 rounded-lg"
          />
          <div>
            <h1 className="text-3xl font-bold mb-2">{user.personaName}</h1>
            {user.realName && (
              <p className="text-gray-400 mb-2">Real name: {user.realName}</p>
            )}
            <p className="text-gray-400">
              Total Games: {games.length} | Friends: {friends.length}
            </p>
            <a
              href={user.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 mt-2 inline-block"
            >
              View Steam Profile →
            </a>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('games')}
          className={`pb-2 px-4 transition-colors ${
            activeTab === 'games' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Games ({games.length})
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`pb-2 px-4 transition-colors ${
            activeTab === 'friends' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Friends ({friends.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'games' && (
        <div>
          {/* Sort Controls */}
          <div className="flex gap-4 mb-6">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="playtime">Sort by Playtime</option>
              <option value="name">Sort by Name</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedGames.map(game => (
              <GameCard
                key={game.appid}
                game={game}
                onClick={() => {
                  setSelectedGame(game);
                  fetchGameStats(game.appid);
                }}
                isSelected={selectedGame?.appid === game.appid}
              />
            ))}
          </div>

          {/* Game Details Modal */}
          {selectedGame && (
            <GameDetailsModal
              game={selectedGame}
              stats={gameStats[selectedGame.appid]}
              onClose={() => setSelectedGame(null)}
            />
          )}
        </div>
      )}

      {activeTab === 'friends' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {friends.map(friend => (
            <FriendCard key={friend.steamid} friend={friend} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDetailsPage;