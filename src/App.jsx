import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Toolbar from "./components/Toolbar";
import IndexPage from "./pages/IndexPage";
import ProfilePage from "./pages/ProfilePage";
import AllUsersPage from "./pages/AllUsersPage";
import GetUserPage from "./pages/GetUserPage";
import ChatPage from "./pages/ChatPage";
import GroupChat from "./components/GroupChat";
import ConversationsPage from "./pages/conversationsPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Toolbar />
        <Routes>
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />
          <Route element={<IndexPage />} path="/" />
          <Route element={<ProfilePage />} path="/profile" />
          <Route element={<AllUsersPage />} path="/all-users" />
          <Route element={<GetUserPage />} path="/user/:username" />
          <Route element={<ChatPage />} path="/chat/:username" />
          <Route element={<GroupChat />} path="/group-chat/:room" />
          <Route element={<ConversationsPage />} path="/conversations" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
