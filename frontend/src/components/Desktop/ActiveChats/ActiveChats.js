import UserCard from './../UserCard/UserCard';

const ActiveChats = ({ activeChats, handleCurrentChat }) => {
  // Array donde se guarda cada usuario con su chat su chat correspondiente
  const uniqueActiveChats = [];

  for (let i = 0; i < activeChats.length; i++) {
    const { IDUser, userFullname, userAvatar, userStatus } =
      activeChats[i].user;
    const user = {
      IDUser,
      userFullname,
      userAvatar,
      userStatus,
      userLastMessage:
        activeChats[i].chats[activeChats[i].chats.length - 1].messageText,
    };

    uniqueActiveChats.push(user);
  }

  return (
    <div className="activeChats">
      {uniqueActiveChats.map((user) => (
        <UserCard
          key={user.IDUser}
          id={user.IDUser}
          fullname={user.userFullname}
          avatar={user.userAvatar}
          status={user.userStatus}
          lastMessage={user.userLastMessage}
          handleCurrentChat={handleCurrentChat}
        />
      ))}
    </div>
  );
};

export default ActiveChats;
