import React from 'react'
import PropTypes from 'prop-types';

const MessageFormPopup = ({closePopup, getName, getMessage, sendMessage, nameValue, messageValue}) => {


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
          <input value="send" className="input-submit" type="submit"></input>
        </form>
        <button onClick={closePopup}>X</button>
    </div>
  )
}

MessageFormPopup.propTypes = {
  closePopup: PropTypes.func.isRequired,
  getName: PropTypes.func.isRequired,
  getMessage: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
  nameValue: PropTypes.string.isRequired,
  messageValue: PropTypes.string.isRequired
};

export default MessageFormPopup
