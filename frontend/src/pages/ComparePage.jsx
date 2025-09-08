import { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import ComparisonResult from '../components/ComparisonResult';

const API_BASE_URL = 'http://localhost:3001/api';

function ComparePage() {
  const [user1, setUser1] = useState(null);
  const [user2, setUser2] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleSearchUser = async (query, userNumber) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/search/${query}`);
      if (userNumber === 1) {
        setUser1(response.data);
      } else {
        setUser2(response.data);
      }
      
      // Clear comparison when changing users
      setComparison(null);
      setRecommendations(null);
    } catch (error) {
      console.error('Error searching user:', error);
    }
  };

  const handleCompare = async () => {
    if (!user1 || !user2) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/compare`, {
        steamId1: user1.steamId,
        steamId2: user2.steamId
      });
      setComparison(response.data);
    } catch (error) {
      console.error('Error comparing users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    if (!comparison) return;

    setLoadingAI(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/recommendations`, {
        user1: comparison.user1,
        user2: comparison.user2,
        commonGames: comparison.commonGames,
        user1Games: comparison.user1Games,
        user2Games: comparison.user2Games
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">
        Compare Steam Users
      </h1>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">User 1</h2>
          <SearchBar 
            onSearch={(query) => handleSearchUser(query, 1)}
            placeholder="Search first user..."
          />
          {user1 && (
            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <img 
                  src={user1.avatarMedium} 
                  alt={user1.personaName}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <p className="font-semibold">{user1.personaName}</p>
                  <p className="text-sm text-gray-400">Selected</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">User 2</h2>
          <SearchBar 
            onSearch={(query) => handleSearchUser(query, 2)}
            placeholder="Search second user..."
          />
          {user2 && (
            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <img 
                  src={user2.avatarMedium} 
                  alt={user2.personaName}
                  className="w-12 h-12 rounded"
                />
                <div>
                  <p className="font-semibold">{user2.personaName}</p>
                  <p className="text-sm text-gray-400">Selected</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {user1 && user2 && (
        <div className="text-center mb-8">
          <button
            onClick={handleCompare}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Comparing...' : 'Compare Libraries'}
          </button>
        </div>
      )}

      {comparison && (
        <>
          <ComparisonResult comparison={comparison} />
          
          <div className="text-center mt-8">
            <button
              onClick={handleGetRecommendations}
              disabled={loadingAI}
              className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loadingAI ? 'Getting AI Recommendations...' : 'Get AI Game Recommendations'}
            </button>
          </div>

          {recommendations && (
            <div className="mt-8 bg-gray-800 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-6 text-purple-400">AI Recommendations</h3>
              
              {recommendations.commonGameRecommendations?.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold mb-4">Games You Should Play Together</h4>
                  <div className="space-y-4">
                    {recommendations.commonGameRecommendations.map((rec, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4">
                        <h5 className="font-semibold text-blue-400 mb-2">{rec.name}</h5>
                        <p className="text-gray-300">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.newGameRecommendations?.length > 0 && (
                <div>
                  <h4 className="text-xl font-semibold mb-4">New Games to Try</h4>
                  <div className="space-y-4">
                    {recommendations.newGameRecommendations.map((rec, index) => (
                      <div key={index} className="bg-gray-700 rounded-lg p-4">
                        <h5 className="font-semibold text-green-400 mb-1">{rec.name}</h5>
                        <p className="text-sm text-gray-400 mb-2">Genre: {rec.genre}</p>
                        <p className="text-gray-300">{rec.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ComparePage;