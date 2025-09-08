import UserCard from './UserCard';

function FavoritesList({ favorites, onRemoveFavorite }) {
  return (
    <div className="grid gap-4">
      {favorites.map((user) => (
        <UserCard
          key={user.steamId}
          user={user}
          showRemoveButton={true}
          showViewDetails={true}
          onToggleFavorite={() => onRemoveFavorite(user.steamId)}
        />
      ))}
    </div>
  );
}

export default FavoritesList;