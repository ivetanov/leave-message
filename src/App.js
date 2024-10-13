import avatar from "./images/avatar-iveta.png";
import { React, useState, useEffect } from "react";
import MessageFormPopup from "./components/MessageFormPopup.js";
import { projectFirestore } from "./firebase/config.js"

const App = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [error, setError] = useState(false);
  const [messagePopupVisible, setMessagePopupVisible] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (name && message) {
      const currentDate = new Date();
      let minutes = currentDate.getMinutes();
      let doubleDigitMinutes = minutes < 10 ? '0' + minutes : minutes;
      const formattedDate = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()} ${currentDate.getHours()}:${doubleDigitMinutes}`
      let newMessage = {name: name, date: formattedDate, message: message}
      try {
        await projectFirestore.collection("messages").add(newMessage)
        setMessage("")
        setName("")
        setMessagePopupVisible(false)  
      }catch(err){
        setError("zpráva nebyla přidána " + err.message)
      }
    }
  };

  const popupVisibility = () => {
    setMessagePopupVisible(false);
  }

  useEffect(() => {
    const unsubscribe = projectFirestore.collection("messages")
      .onSnapshot((snapshot) => {
        if (snapshot.empty) {
          setError("no messages in database");
        } else {
          let result = [];
          snapshot.docs.forEach((oneMessage) => {
            result.push({ id: oneMessage.id, ...oneMessage.data() });
          });
          result.sort((a, b) => new Date(a.date) - new Date(b.date));
          setAllMessages(result);
        }
      }, (err) => setError(err.message));
  
    return () => unsubscribe();
  }, []);
  
  return (
    <div className="app">
      {error && <p>{error}</p>}
      <header>
        <h2>Leave a message</h2>
        <img className="avatar" src={avatar} alt="authors avatar"></img>
      </header>
      <div className="message-board" >
        {allMessages.map((singleMessage) => {
          return (
            <div className="single-card" key={singleMessage.id}>
              <div className="miniheader">
                <p className="name">{singleMessage.name}</p>
                <p className="date">{singleMessage.date}</p>
              </div>
              <p className="message">{singleMessage.message}</p>
            </div>
          );
        })}
        <div onClick={()=>setMessagePopupVisible(true)} className="single-card add-message">
          <p>+</p>
        </div>
      </div>
      <div className="type-area">
        <form onSubmit={sendMessage} className="message-form">
          <input onChange={(e) => setName(e.target.value)}
            placeholder="your name"
            className="input-name"
            type="text"
            value={name}
          ></input>
          <input
            onChange={(e) => setMessage(e.target.value)}
            placeholder="your message"
            className="input-text"
            type="text"
            value={message}
          ></input>
          <input value="send" className="input-submit" type="submit"></input>
        </form>
      </div>
      {messagePopupVisible && <MessageFormPopup closePopup={popupVisibility} getName ={(e) => setName(e.target.value)} getMessage ={(e) => setMessage(e.target.value)} sendMessage = {sendMessage} nameValue={name} messageValue={message}/>}
    </div>
  );
};

export default App;
// TODO:
// výška karet na malých zařízeních se upravuje podle obsahu
// karty na velkých zařízeních - on hover - ukáže se zbytek + šipka nebo rozostření
// na malých zař poslední karta nejde vidět (čím menší, tím hůře)
// info ikona s informacemi
// při kliknutí na avatar se ukáže info o mně
// udělat scrollbar atraktivnější
// když je otevřený MessageFormPopup a zmenší se zařízení na malé, chci aby se popup zavřel a data se přepsaly do "type-area"
// firebase kapacity - snad vyřešeno, musím počkat na výsledek

// PROJECT INFO:
// - komentáře od fiktivních filmových postav vygenerovalo AI, zbytek komentářů je od reálných lidí
// - použito: react, usestate, useeffect, proptypes, firebase, useRef

