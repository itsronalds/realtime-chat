import './UserCard.css';

const UserCard = ({
  id,
  fullname,
  avatar,
  lastMessage,
  status,
  handleCurrentChat,
  type,
}) => {
  // Objeto de usuario para el chat actual
  const currentChat = {
    IDUser: id,
    userFullname: fullname,
    userAvatar: avatar,
    userStatus: status,
  };

  return (
    <div className="userCard" onClick={() => handleCurrentChat(currentChat)}>
      <img className="userCard__avatar" src={avatar} alt={fullname} />

      <div className="userCard__texts">
        <span className="userCard__name">{fullname}</span>

        {lastMessage && (
          <small className="userCard__lastMessage">
            {lastMessage.length > 15
              ? `${lastMessage.slice(0, 15)}...`
              : lastMessage}
          </small>
        )}
      </div>

      {type !== 'User found' && (
        <div
          className={`userCard__status userCard__status--${
            status === 1 ? 'online' : 'offline'
          }`}
        ></div>
      )}
    </div>
  );
};

export default UserCard;
