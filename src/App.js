import avatar from "./images/avatar-iveta.png";
import { React, useState, useEffect } from "react";
import MessageFormPopup from "./components/MessageFormPopup.js";
import { projectFirestore } from "./firebase/config.js";

const App = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const [error, setError] = useState(false);
  const [messagePopupVisible, setMessagePopupVisible] = useState(false);
  const [shortestColumn, setShortestColumn] = useState({columnOne: null, columnTwo: null, columnThree: null});
  const [addMesButtonPos, setAddMesButtonPos] = useState(1);  // Defaultně v prvním sloupci.

  // Nastavení výšky jednotlivých sloupců
  useEffect(() => {
    let colOne = 0;
    let colTwo = 0;
    let colThree = 0;
    allMessages.forEach(mes => {
      if (mes.column === 1) {
        colOne += (mes.message.length + 80);
      } else if (mes.column === 2) {
        colTwo += (mes.message.length + 80);
      } else {
        colThree += (mes.message.length + 80);
      }
    });
    setShortestColumn({ columnOne: colOne, columnTwo: colTwo, columnThree: colThree });
  }, [allMessages]);

  // Logika pro odeslání zprávy
  const sendMessage = async (e) => {
    e.preventDefault();
    if (name && message) {
      let selectedColumn = 1;
      if (allMessages.length === 0) {
        selectedColumn = 1;
      } else if (allMessages.length === 1) {
        selectedColumn = 2;
      } else if (allMessages.length === 2){
        selectedColumn = 3
      } else {
        if ((shortestColumn.columnOne <= shortestColumn.columnTwo) && (shortestColumn.columnOne <= shortestColumn.columnThree)) {
          selectedColumn = 1;
        } else if (shortestColumn.columnTwo <= shortestColumn.columnThree) {
          selectedColumn = 2;
        } else {
          selectedColumn = 3;
        }
      }
      let cardIndex = (allMessages.length + 1);
      const currentDate = new Date();
      let minutes = currentDate.getMinutes();
      let doubleDigitMinutes = minutes < 10 ? '0' + minutes : minutes;
      const formattedDate = `${currentDate.getDate()}.${currentDate.getMonth() + 1}.${currentDate.getFullYear()} ${currentDate.getHours()}:${doubleDigitMinutes}`;
      let newMessage = { name: name, date: formattedDate, message: message, column: selectedColumn, cardIndex: cardIndex };
      try {
        await projectFirestore.collection("messages").add(newMessage);
        setMessage("");
        setName("");
        setMessagePopupVisible(false);
      } catch (err) {
        setError("zpráva nebyla přidána " + err.message);
      }
    }
  };

  // Nastavení pozice tlačítka na základě počtu zpráv
  useEffect(() => {
    if (allMessages.length === 0) {
      setAddMesButtonPos(1);  // Zobrazí tlačítko v prvním sloupci
    } else if (allMessages.length === 1) {
      setAddMesButtonPos(2);  // Zobrazí tlačítko ve druhém sloupci
    } else {
      setAddMesButtonPos(3);  // Zobrazí tlačítko ve třetím sloupci
    }
  }, [allMessages]);

  const popupVisibility = () => {
    setMessagePopupVisible(false);
  };

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

  useEffect(() => {
    console.log(shortestColumn.columnOne);
    console.log(shortestColumn.columnTwo);
    console.log(shortestColumn.columnThree);
  }, [shortestColumn]);

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter') && (message) && (name)) {
      sendMessage(e);
    }
  };

  return (
    <div className="app">
      {error && <p>{error}</p>}
      <header>
        <h2>Leave a message</h2>
        <img className="avatar" src={avatar} alt="authors avatar"></img>
      </header>
      <div className="message-board">
        <div className="columnOne">
          {addMesButtonPos === 1 && <div onClick={() => setMessagePopupVisible(true)} className="single-card add-message">
            <p>+</p>
          </div>}
          {allMessages
            .filter((oneMessage) => oneMessage.column === 1)
            .sort((a, b) => a.cardIndex - b.cardIndex) // Řadíme podle cardIndex od nejvyššího k nejnižšímu
            .map((oneMessage) => (
              <div className="single-card" key={oneMessage.id}>
                <div className="miniheader">
                  <p className="name">{oneMessage.name}</p>
                  <p className="date">{oneMessage.date}</p>
                </div>
                <p className="message">{oneMessage.message}</p>
              </div>
            ))
          }
        </div>
        <div className="columnTwo">
          {addMesButtonPos === 2 && <div onClick={() => setMessagePopupVisible(true)} className="add-message single-card">
            <p>+</p>
          </div>}
          {allMessages
            .filter((oneMessage) => oneMessage.column === 2) 
            .sort((a, b) => a.cardIndex - b.cardIndex) 
            .map((oneMessage) => (
              <div className="single-card" key={oneMessage.id}>
                <div className="miniheader">
                  <p className="name">{oneMessage.name}</p>
                  <p className="date">{oneMessage.date}</p>
                </div>
                <p className="message">{oneMessage.message}</p>
              </div>
            ))
          }
        </div>
        <div className="columnThree">
          {allMessages
            .filter((oneMessage) => oneMessage.column === 3) 
            .sort((a, b) => a.cardIndex - b.cardIndex) 
            .map((oneMessage) => (
              <div className="single-card" key={oneMessage.id}>
                <div className="miniheader">
                  <p className="name">{oneMessage.name}</p>
                  <p className="date">{oneMessage.date}</p>
                </div>
                <p className="message">{oneMessage.message}</p>
              </div>
            ))
          }          
          {addMesButtonPos === 3 && <div onClick={() => setMessagePopupVisible(true)} className="single-card add-message">
              <p>+</p>
            </div>}
        </div>
        <div className="column-small-devices">
        {allMessages
            .sort((a, b) => a.cardIndex - b.cardIndex) 
            .map((oneMessage) => (
              <div className="single-card" key={oneMessage.id}>
                <div className="miniheader">
                  <p className="name">{oneMessage.name}</p>
                  <p className="date">{oneMessage.date}</p>
                </div>
                <p className="message">{oneMessage.message}</p>
              </div>
            ))
          }          
        </div>
      </div>
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
            maxLength={200}
            onKeyDown={handleKeyDown}
          ></textarea>
          
          <input value="send" className="input-submit" type="submit"></input>
        </form>
      </div>
      {messagePopupVisible && <MessageFormPopup closePopup={popupVisibility} getName={(e) => setName(e.target.value)} getMessage={(e) => setMessage(e.target.value)} sendMessage={sendMessage} nameValue={name} messageValue={message} />}
    </div>
  );
};

export default App;

// nainstalovat eslint
// moderní design
// zeptat se chat gpt jestli je muj kod fajn pro prezentaci

// použito: usestate, useeffect, firebase, node.js