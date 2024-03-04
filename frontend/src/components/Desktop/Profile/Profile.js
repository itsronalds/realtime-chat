import './Profile.css';
import ActiveChats from './../ActiveChats/ActiveChats';
import UserCard from './../UserCard/UserCard';

const Profile = ({
  profile,
  findUserFullname,
  findUser,
  usersFound,
  setUsersFound,
  showActiveChats,
  setShowActiveChats,
  activeChats,
  handleCurrentChat,
  disconnect,
}) => {
  // Profile data
  const { userFullname, userAvatar } = profile;

  // Components functions
  const handleOnFocus = (e) => {
    if (e.currentTarget === e.target) setShowActiveChats(false);
  };

  const handleOnBlur = (e) => {
    if (e.currentTarget === e.target && e.target.value.length === 0) {
      setUsersFound([]);
      setShowActiveChats(true);
    }
  };

  return (
    <div className="profile">
      {/* SearchUsers component */}
      <div className="searchUsers">
        <i className="searchUsers__icon fas fa-search"></i>

        <input
          className="searchUsers__input"
          type="text"
          placeholder="Enter name..."
          ref={findUserFullname}
          onFocus={(e) => handleOnFocus(e)}
          onBlur={(e) => handleOnBlur(e)}
          onChange={findUser}
        />
      </div>

      <div className="profile__avatarContainer">
        <img className="profile__avatar" src={userAvatar} alt={userFullname} />
      </div>

      <div className="profile__users">
        {showActiveChats === true ? (
          <ActiveChats
            activeChats={activeChats}
            handleCurrentChat={handleCurrentChat}
          />
        ) : (
          <>
            {/* Usuarios encontrados al buscar */}
            {usersFound.map((user) => (
              <UserCard
                key={user.IDUser}
                id={user.IDUser}
                fullname={user.userFullname}
                avatar={user.userAvatar}
                status={user.userStatus}
                handleCurrentChat={handleCurrentChat}
                type="User found"
              />
            ))}
          </>
        )}
      </div>

      <div className="profile__logOut">
        <button
          className="profile__logOutButton"
          type="button"
          onClick={disconnect}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default Profile;
