import './Message.css';
import { useEffect } from 'react';
import { formatDatetime } from './../../../utils/date';

const Message = ({ avatar, message, date, type, focus }) => {
  useEffect(() => {
    if (focus?.state === true) {
      return focus.elementRef.current.focus();
    }

    return;
  }, [focus?.elementRef]);

  return (
    <div
      className="message"
      style={{
        justifyContent: type === 'outgoing' ? 'flex-end' : 'flex-start',
      }}
      ref={focus?.state === true ? focus.elementRef : null}
      tabIndex={focus?.state === true ? '-1' : null}
    >
      {type === 'incoming' && (
        <img className="message__userAvatar" src={avatar} />
      )}

      <div className="message__texts">
        <div
          className={`message__text message__text--${
            type === 'outgoing' ? 'outgoing' : 'incoming'
          }`}
        >
          {message}
        </div>

        <div className="message__date">
          <span className="message__dateText">{formatDatetime(date)[0]}</span>
          <span className="message__datetimeText">
            {formatDatetime(date)[1]}
          </span>
        </div>
      </div>

      {type === 'outgoing' && (
        <img className="message__userAvatar" src={avatar} />
      )}
    </div>
  );
};

export default Message;
