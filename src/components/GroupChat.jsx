import { useEffect, useRef, useState } from "react";
import mainStore from "../store/mainStore";
import http from "../plugins/http";
import { Link, useParams } from "react-router-dom";
import { socket } from "../plugins/sockets";

function GroupChat() {
  const messageRef = useRef();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const { user: myUser, token } = mainStore();
  const { room } = useParams();

  useEffect(() => {
    socket.emit("joinRoom", room);

    return () => {
      socket.emit("leaveRoom", room);
    };
  }, [room]);

  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    const msg = {
      room,
      message: messageRef.current.value,
      sender: myUser.username,
      isGroup: true,
    };
    const res = await http.postAuth("/sendMessage", msg, token);
    if (res.data && !res.data.error) {
      messageRef.current.value = "";
    } else {
      console.error(res.message);
    }
  };

  return (
    <div>
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/all-users">All users</Link>
          </li>
          <li>Group Chat</li>
        </ul>
      </div>
      <div className="flex flex-col justify-between bg-slate-200 w-[70%] mx-auto mt-10 mb-20 px-5 py-1 rounded-md h-[500px]">
        <div className="bg-red-200 overflow-auto h-full">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat ${
                msg.sender === myUser.username ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img alt="Avatar" src={myUser.image} />
                </div>
              </div>
              <div className="chat-header">
                {msg.sender}
                <time className="text-xs opacity-50">
                  {new Date(msg.time).toLocaleTimeString()}
                </time>
              </div>
              <div className="chat-bubble">{msg.message}</div>
              <div className="chat-footer opacity-50">Delivered</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="w-full flex">
          <textarea
            className="w-full h-20"
            ref={messageRef}
            placeholder="Enter your message"
          ></textarea>
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default GroupChat;
