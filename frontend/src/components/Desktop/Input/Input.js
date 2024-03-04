import './Input.css';

const Input = ({ message, sendMessage, emojiPicker, setEmojiPicker }) => {
  const handleClick = () => setEmojiPicker(!emojiPicker);

  return (
    <div className="input">
      <i className="input__emojiIcon far fa-smile" onClick={handleClick}></i>

      <input
        className="input__input"
        type="text"
        placeholder="Type message..."
        ref={message}
      />

      <div className="input__iconContainer" onClick={sendMessage}>
        <i className="input__icon fas fa-paper-plane"></i>
      </div>
    </div>
  );
};

export default Input;
