import './ChatRoom.css';
import { useRef } from 'react';
import Picker from 'emoji-picker-react';
import Input from './../Input/Input';
import Message from './../Message/Message';

const ChatRoom = ({
  profile,
  currentChat,
  message,
  sendMessage,
  emojiPicker,
  setEmojiPicker,
}) => {
  const elementRef = useRef(null);

  const messageFocus = (index) =>
    currentChat?.chat && index === currentChat.chat.length - 1
      ? { state: true, elementRef }
      : null;

  const onEmojiClick = (e, emojiObject) => {
    try {
      message.current.value += emojiObject.emoji;
    } catch (err) {
      console.log('Ocurrio un error con la función de emoji');
    }
  };

  return (
    <div className="chatRoom">
      {/* ChatRoomHeader */}
      <div className="chatRoom__header">
        <img
          className="chatRoom__headerUserAvatar"
          src={currentChat.userAvatar}
          alt="Ronald Abu Saleh"
        />

        <span className="chatRoom__headerUserFullname">
          {currentChat.userFullname}
        </span>

        <div
          className={`chatRoom__headerUserStatus chatRoom__headerUserStatus--${
            currentChat.userStatus === 1 ? 'online' : 'offline'
          }`}
        ></div>

        <span className="chatRoom__headerUserStatusText">
          {currentChat.userStatus === 1 ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* ChatRoomBody */}
      <div className="chatRoom__body">
        {currentChat?.chat &&
          currentChat.chat.map((message, index) => {
            return message.messageOutgoingUserId !== currentChat.IDUser ? (
              <Message
                key={message.IDMessage}
                avatar={profile.userAvatar}
                message={message.messageText}
                date={message.messageCreatedAt}
                type="outgoing"
                focus={messageFocus(index)}
              />
            ) : (
              <Message
                key={message.IDMessage}
                avatar={currentChat.userAvatar}
                message={message.messageText}
                date={message.messageCreatedAt}
                type="incoming"
                focus={messageFocus(index)}
              />
            );
          })}
      </div>

      {/* Input component */}
      <div className="chatRoom__footer">
        {emojiPicker === true && (
          <Picker
            onEmojiClick={onEmojiClick}
            pickerStyle={{
              position: 'absolute',
              left: '0',
              bottom: '50px',
              width: '100%',
              height: '220px',
              boxShadow: '0 0 0 #fff',
            }}
            disableSearchBar={true}
            disableAutoFocus={true}
          />
        )}

        <Input
          message={message}
          sendMessage={sendMessage}
          {...{ emojiPicker, setEmojiPicker }}
        />
      </div>
    </div>
  );
};

export default ChatRoom;
