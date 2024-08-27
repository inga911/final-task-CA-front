import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Toolbar from "./components/Toolbar";
import IndexPage from "./pages/IndexPage";
import ProfilePage from "./pages/ProfilePage";
import AllUsersPage from "./pages/AllUsersPage";
import GetUserPage from "./pages/GetUserPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Toolbar />
        <Routes>
          <Route element={<LoginPage />} path="/login" />
          <Route element={<RegisterPage />} path="/register" />
          <Route element={<IndexPage />} path="/home" />
          <Route element={<ProfilePage />} path="/profile" />
          <Route element={<AllUsersPage />} path="/all-users" />
          <Route element={<GetUserPage />} path="/user/:username" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
