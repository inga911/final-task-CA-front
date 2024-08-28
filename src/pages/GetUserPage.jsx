import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import http from "../plugins/http";
import mainStore from "../store/mainStore";

function GetUserPage() {
  const { username } = useParams();
  const { user: myUser } = mainStore();
  const [user, setUser] = useState([]);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    http
      .get(`/getUser/${username}`)
      .then((res) => {
        if (res.error) {
          setError(res.message);
        } else {
          setUser(res.data);
        }
      })
      .catch(() => setError("Failed to fetch user data."));
  }, [username]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!myUser) {
    nav("/");
    return null;
  }

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
          <li>User {user.username} </li>
        </ul>
      </div>

      <div className="card bg-base-100 w-96 mx-auto shadow-xl">
        <figure className="px-10 pt-10">
          <img
            src={user.image}
            alt={user.username}
            className="w-[80%] h-[300px] object-cover rounded-xl"
          />
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">{user.username}</h2>
          <div className="card-actions">
            <button
              className="btn btn-primary"
              onClick={() => nav(`/chat/${username}`)}
            >
              Start conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetUserPage;
