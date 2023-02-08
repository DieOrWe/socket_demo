import React, { useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function App() {
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [greetings, setGreetings] = useState([]);

  function connect() {
    const socket = new SockJS('http://localhost:8080/gs-guide-websocket');
    const client = Stomp.over(socket);
    client.connect({}, frame => {
      setConnected(true);
      console.log('Connected: ' + frame);
      client.subscribe('/topic/greetings', greeting => {
        showGreeting(JSON.parse(greeting.body).content);
      });
      setStompClient(client);
    });
  }

  function disconnect() {
    if (stompClient !== null) {
      stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
  }

  function sendName(name) {
    stompClient.send("/app/hello", {}, JSON.stringify({ name }));
  }

  function showGreeting(message) {
    setGreetings([...greetings, message]);
  }

  return (
    <div>
      {!connected && <button id="connect" onClick={connect}>Connect</button>}
      {connected && <button id="disconnect" onClick={disconnect}>Disconnect</button>}
      {connected && (
        <div id="conversation">
          <input id="name" type="text" />
          <button id="send" onClick={() => sendName(document.getElementById('name').value)}>Send</button>
          <table id="greetings">
            <tbody>
              {greetings.map((greeting, index) => (
                <tr key={index}>
                  <td>{greeting}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;