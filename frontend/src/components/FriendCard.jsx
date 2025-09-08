import { Link } from 'react-router-dom';

function FriendCard({ friend }) {
  const getStatusColor = (state) => {
    if (state === 0) return 'bg-gray-600';
    if (state === 1) return 'bg-green-600';
    return 'bg-yellow-600';
  };

  return (
    <Link
      to={`/user/${friend.steamid}`}
      className="block bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={friend.avatarmedium}
            alt={friend.personaname}
            className="w-12 h-12 rounded"
          />
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${getStatusColor(friend.personastate)}`}></div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{friend.personaname}</h3>
          {friend.gameextrainfo && (
            <p className="text-sm text-blue-400 truncate">Playing: {friend.gameextrainfo}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default FriendCard;