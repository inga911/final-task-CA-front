import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import mainStore from "../store/mainStore";
import http from "../plugins/http";
import { socket } from "../plugins/sockets";

function SingleChat() {
  const messageRef = useRef();
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [room, setRoom] = useState(null);
  const { user: myUser, token } = mainStore();
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!myUser) {
      navigate("/");
      return;
    }

    if (username) {
      initializeChat();
    }
  }, [myUser, username, token, navigate]);

  useEffect(() => {
    if (!room) return;

    socket.emit("joinRoom", room);
    console.log(`User joined room: ${room}`);

    return () => {
      socket.emit("leaveRoom", room);
      console.log(`User left room: ${room}`);
    };
  }, [room]);

  useEffect(() => {
    const handleMessage = (newMessage) => {
      const formattedMessage = {
        ...newMessage,
        from: newMessage.sender,
        to: newMessage.receiver,
        time: new Date(newMessage.time),
      };

      setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    };

    socket.on("newMessage", handleMessage);

    return () => {
      socket.off("newMessage", handleMessage);
    };
  }, [myUser.username]);

  useEffect(() => {
    const handleLikeUpdate = (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === updatedMessage.messageId
            ? { ...msg, liked: updatedMessage.liked }
            : msg
        )
      );
    };

    socket.on("messageLiked", handleLikeUpdate);

    return () => {
      socket.off("messageLiked", handleLikeUpdate);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initializeChat = async () => {
    try {
      const fetchedUser = await getUser(username);
      setUser(fetchedUser);

      const chatRoom = createRoom(myUser.username, fetchedUser.username);
      setRoom(chatRoom);

      const fetchedMessages = await fetchMessages(
        myUser.username,
        fetchedUser.username,
        token
      );

      const formattedMessages = fetchedMessages.map((msg) => ({
        ...msg,
        time: new Date(msg.time),
      }));

      setMessages(formattedMessages);
    } catch (err) {
      setError("Failed to initialize chat.", err);
    }
  };

  const getUser = async (username) => {
    try {
      const response = await http.get(`/getUser/${username}`);
      if (response.error) {
        throw new Error(response.message);
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error.message);
      throw error;
    }
  };

  const fetchMessages = async (sender, receiver, token) => {
    try {
      const response = await http.get(
        `/getMessages/${sender}/${receiver}`,
        token
      );
      if (response.error) {
        console.error("Error fetching messages:", response.message);
        return [];
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching messages:", error.message);
      return [];
    }
  };

  const sendMessage = async () => {
    const msg = {
      receiver: user.username,
      message: messageRef.current.value,
      sender: myUser.username,
      time: new Date().toISOString(),
    };

    try {
      const res = await http.postAuth("/sendMessage", msg, token);
      if (res.data && !res.data.error) {
        messageRef.current.value = "";
        socket.emit("sendMessage", msg);
      } else {
        console.error("Error sending message:", res.message);
      }
    } catch (err) {
      console.error("Network error or server did not respond:", err);
    }
  };

  const createRoom = (user1, user2) => {
    return [user1, user2].sort().join("_");
  };

  const likeMessage = async (msgId) => {
    console.log("Liking/unliking message with ID:", msgId);

    if (!msgId) {
      console.error("Message ID is undefined!");
      return;
    }

    try {
      const response = await http.postAuth(`/likeMessage/${msgId}`, {}, token);
      if (response.data && !response.data.error) {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === msgId ? { ...msg, liked: !msg.liked } : msg
          )
        );
      } else {
        console.error("Error liking message:", response.message);
      }
    } catch (error) {
      console.error("Error liking message:", error);
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
          <li>
            {user && (
              <Link to={`/user/${user.username}`}>User {user.username}</Link>
            )}
          </li>
          <li>Chat</li>
        </ul>
      </div>

      <div className="flex flex-col justify-between w-[70%] mx-auto mt-10 mb-20 rounded-md h-[500px] border-2 overflow-hidden">
        <div className="flex justify-center items-center gap-3 p-3 bg-blue-300/75">
          {user && (
            <>
              <img
                src={user.image}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>{user.username}</div>
            </>
          )}
        </div>

        <div className="bg-gray-100 overflow-auto h-full">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat ${
                msg.from === myUser.username ? "chat-end" : "chat-start"
              }`}
              onDoubleClick={() => likeMessage(msg._id)}
            >
              <div className="chat-image avatar">
                <div className="w-8 rounded-full">
                  <img
                    alt="Avatar"
                    src={
                      msg.from === myUser.username ? myUser.image : user?.image
                    }
                  />
                </div>
              </div>
              <div className="chat-header flex gap-3 items-baseline">
                <time className="text-xs opacity-50">
                  {msg.time instanceof Date && !isNaN(msg.time)
                    ? msg.time.toLocaleTimeString()
                    : "Invalid Date"}
                </time>
              </div>
              <div
                className={`chat-bubble ${
                  msg.from === myUser.username
                    ? "bg-blue-500"
                    : "bg-gray-300 text-black"
                }`}
              >
                {msg.message} {msg.liked && "❤️"}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="w-full flex">
          <textarea
            className="w-full h-20 resize-none p-2 active:outline-none"
            ref={messageRef}
            placeholder="Enter your message"
          ></textarea>
          <button onClick={sendMessage}>
            <img
              className="w-20 h-20 hover:scale-125 transition-all"
              src="https://cdni.iconscout.com/illustration/premium/thumb/send-message-illustration-download-in-svg-png-gif-file-formats--a-money-payment-pack-user-interface-illustrations-6154006.png?f=webp"
              alt=""
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleChat;
