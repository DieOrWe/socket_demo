import React, { useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import "./App.css"

function App() {
  const [state, setState] = useState({ type: "", roomid: "", sender: "", message: "" })
  const [chat, setChat] = useState([])

  const socketRef = useRef()

  useEffect(
    () => {
      socketRef.current = io.connect("ws://localhost:8080", {
        path: '/ws/chat',
        transports: ['websocket']
      })
      socketRef.current.on("message", ({ type, roomid, sender, message }) => {
        setChat([...chat, { sender, message }])
      })
      console.log('useEffect');
      return () => socketRef.current.disconnect()
    },
    [chat]
  )

  const onTextChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const onMessageSubmit = (e) => {
    const { sender, message } = state
    socketRef.current.emit("message", { type:"TALK", roomid:"2e820745-3673-4cab-a180-e094649930c7", sender, message })
    e.preventDefault()
    setState({ message: "", sender })
  }

  const renderChat = () => {
    return chat.map(({ sender, message }, index) => (
      <div key={index}>
        <h3>
          {sender}: <span>{message}</span>
        </h3>
      </div>
    ))
  }

  const handleEnter = () => {
    socketRef.current.emit("message", { type:"ENTER", roomid:"2e820745-3673-4cab-a180-e094649930c7", sender:"사용자1", message:"" })
    console.log('입장완료!!');
  }

  return (
    <div className="card">
      <form onSubmit={onMessageSubmit}>
        <h1>Messenger</h1>
        <div className="name-field">
          <input name="sender" onChange={(e) => onTextChange(e)} value={state.sender} label="Name" />
        </div>
        <div>
          <input
            name="message"
            onChange={(e) => onTextChange(e)}
            value={state.message}
            id="outlined-multiline-static"
            variant="outlined"
            label="Message"
          />
        </div>
        <button>Send Message</button>
      </form>
      <div className="render-chat">
        <h1>Chat Log</h1>
        {renderChat()}
      </div>
      <button onClick={handleEnter}>입장</button>
    </div>
  )
}

export default App