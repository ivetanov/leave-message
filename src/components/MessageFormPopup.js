import React from 'react'
import PropTypes from 'prop-types';

const MessageFormPopup = ({closePopup, getName, getMessage, sendMessage, nameValue, messageValue}) => {

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter') && (messageValue) && (nameValue)) {
      sendMessage(e);
    }
  };

  return (
    <div className='message-form-popup'>
      <form onSubmit={sendMessage} className="message-form">
          <input onChange={getName}
            placeholder="your name"
            className="input-name"
            type="text"
            value={nameValue}
          ></input>
          <input
            onChange={getMessage}
            placeholder="your message"
            className="input-text"
            id='input-message'
            type="text"
            value={messageValue}
          ></input>
          <textarea
            onChange={getMessage}
            placeholder="your message"
            className="input-text"
            value={messageValue}
            maxLength={200}
            onKeyDown={handleKeyDown}
          ></textarea>
          <input value="send" className="input-submit" type="submit"></input>
        </form>
        <button className='closeButton' onClick={closePopup}>X</button>
    </div>
  )
}
/*
      <div className="type-area">
        <form onSubmit={sendMessage} className="message-form">
          <input
            onChange={(e) => setName(e.target.value)}
            placeholder="your name"
            className="input-name"
            type="text"
            value={name}
          ></input>
          
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            placeholder="your message"
            className="input-text"
            value={message}
            rows="4"  // nastavení počtu řádků, můžete změnit podle potřeby
            maxLength={200}
            onKeyDown={handleKeyDown}
          ></textarea>
          
          <input value="send" className="input-submit" type="submit"></input>
        </form>
      </div>

*/
MessageFormPopup.propTypes = {
  closePopup: PropTypes.func.isRequired,
  getName: PropTypes.func.isRequired,
  getMessage: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  nameValue: PropTypes.string.isRequired,
  messageValue: PropTypes.string.isRequired
};

export default MessageFormPopup
