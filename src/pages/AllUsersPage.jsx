import { useEffect, useState } from "react";
import http from "../plugins/http";
import SingleUser from "../components/SingleUser";
import { socket } from "../plugins/sockets";

function AllUsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    http.get("/getAllUsers").then((res) => {
      setUsers(res.data);
    });

    socket.on("profileImageUpdated", ({ userId, image }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, image } : user
        )
      );
    });

    socket.on("usernameUpdated", ({ userId, username }) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, username } : user
        )
      );
    });

    return () => {
      socket.off("profileImageUpdated");
      socket.off("usernameUpdated");
    };
  }, []);

  return (
    <div className="d-flex flex-wrap justify-content-center gap-3 p-4">
      {users.length > 0 ? (
        users.map((x, i) => <SingleUser key={i} singleUser={x} />)
      ) : (
        <h1>No users yet</h1>
      )}
    </div>
  );
}

export default AllUsersPage;
