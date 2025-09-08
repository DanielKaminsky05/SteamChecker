import { Link } from 'react-router-dom';

function UserCard({ user, isFavorite, onToggleFavorite, showRemoveButton = false, showViewDetails = false }) {
  const getStatusText = (state) => {
    const states = {
      0: 'Offline',
      1: 'Online',
      2: 'Busy',
      3: 'Away',
      4: 'Snooze',
      5: 'Looking to trade',
      6: 'Looking to play'
    };
    return states[state] || 'Unknown';
  };

  const getStatusColor = (state) => {
    if (state === 0) return 'text-gray-500';
    if (state === 1) return 'text-green-500';
    return 'text-yellow-500';
  };

  const formatLastOnline = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-start gap-4">
        <img
          src={user.avatarFull}
          alt={user.personaName}
          className="w-24 h-24 rounded-lg"
        />
        
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xl font-semibold">{user.personaName}</h3>
            <div className="flex gap-2">
              {showViewDetails && (
                <Link
                  to={`/user/${user.steamId}`}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                >
                  View Details
                </Link>
              )}
              <button
                onClick={onToggleFavorite}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isFavorite || showRemoveButton
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isFavorite || showRemoveButton ? 'Remove Favorite' : 'Add Favorite'}
              </button>
            </div>
          </div>
          
          {user.realName && (
            <p className="text-gray-400 mt-1">Real name: {user.realName}</p>
          )}
          
          <div className="mt-3 space-y-1">
            <p className={`${getStatusColor(user.personaState)} font-medium`}>
              Status: {getStatusText(user.personaState)}
            </p>
            
            {user.gameExtraInfo && (
              <p className="text-blue-400">
                Playing: {user.gameExtraInfo}
              </p>
            )}
            
            {user.personaState === 0 && user.lastLogOff && (
              <p className="text-gray-400 text-sm">
                Last online: {formatLastOnline(user.lastLogOff)}
              </p>
            )}
            
            <a
              href={user.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              View Steam Profile →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;