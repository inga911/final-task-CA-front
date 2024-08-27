import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import http from "../plugins/http";

function GetUserPage() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
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

  if (!user) {
    return nav("/home");
  }

  return (
    <div>
      <h1>{`${user.username}'s Profile`}</h1>
      <img src={user.image} alt={user.username} className="w-44 h-44" />
    </div>
  );
}

export default GetUserPage;
