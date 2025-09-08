import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';
import FavoritesList from '../components/FavoritesList';

const API_BASE_URL = 'http://localhost:3001/api';

function HomePage() {
  const [searchResult, setSearchResult] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/favorites`);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError('');
    setSearchResult(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/search/${query}`);
      setSearchResult(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setError('User not found. Try using Steam ID or profile name.');
      } else {
        setError('An error occurred while searching.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddFavorite = async (steamId) => {
    try {
      await axios.post(`${API_BASE_URL}/favorites/${steamId}`);
      fetchFavorites();
    } catch (error) {
      console.error('Error adding favorite:', error);
    }
  };

  const handleRemoveFavorite = async (steamId) => {
    try {
      await axios.delete(`${API_BASE_URL}/favorites/${steamId}`);
      fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const isFavorite = (steamId) => {
    return favorites.some(fav => fav.steamId === steamId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">
        Steam User Search
      </h1>

      <SearchBar onSearch={handleSearch} />

      {loading && (
        <div className="text-center mt-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-center">
          {error}
        </div>
      )}

      {searchResult && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Search Result</h2>
          <UserCard
            user={searchResult}
            isFavorite={isFavorite(searchResult.steamId)}
            onToggleFavorite={() => 
              isFavorite(searchResult.steamId) 
                ? handleRemoveFavorite(searchResult.steamId)
                : handleAddFavorite(searchResult.steamId)
            }
            showViewDetails={true}
          />
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
        {favorites.length > 0 ? (
          <FavoritesList
            favorites={favorites}
            onRemoveFavorite={handleRemoveFavorite}
          />
        ) : (
          <p className="text-gray-400">No favorites yet. Search and add some users!</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;