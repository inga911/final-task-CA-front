import { useEffect, useState } from "react";
import http from "../plugins/http";
import SingleUser from "../components/SingleUser";
import { socket } from "../plugins/sockets";
import mainStore from "../store/mainStore";
import { Link, useNavigate } from "react-router-dom";

function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState({});
  const { user } = mainStore();
  const nav = useNavigate();

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

  const handleCheckboxChange = (username, isChecked) => {
    setCheckedUsers((prev) => ({ ...prev, [username]: isChecked }));
  };

  // const checkedUsersCount = Object.values(checkedUsers).filter(Boolean).length;

  // const startGroupChat = () => {
  //   const selectedUsers = Object.keys(checkedUsers).filter(
  //     (username) => checkedUsers[username]
  //   );
  //   const room = [user.username, ...selectedUsers].sort().join("_");

  //   // Emit to server to create/join group room
  //   socket.emit("joinRoom", room);

  //   // Navigate to the group chat page with the room ID
  //   nav(`/group-chat/${room}`);
  // };
  useEffect(() => {
    if (!user) {
      nav("/");
    }
  }, [user, nav]);

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
        </ul>
      </div>

      <div className="mx-auto w-[90%] md:w-[60%] border-2 mt-20 p-5 rounded-lg border-gray-700 shadow-md">
        <div>
          {/* {checkedUsersCount > 1 && (
            <div>
              <button className="btn">
                {" "}
                <img
                  src="https://d1jj76g3lut4fe.cloudfront.net/processed/thumb/MEKSa34K4uDh8463uR.png?Expires=1724658104&Signature=Z5IXZuVxo~FSB~jvYteYZJdrDtPYivgKJuufcxhclyPo4rRCQDPI7XPe-67SMAGuHF7vX2WOwSzULoLFCRTFuOanOGJVjHNXS3Zc3bOXI7m5QaQLTCmh3UX-iZ~qKJLOeENX-6SqTK42mujW8QxFXe9S6VgFRajeFWsQ8sKrUJMnHAX2LgcxDJsKklOTJOvvJNLkDfddQf9eQy6T-FXZLfUonDPsVehmiT3K21JALhAYAaSa40JOtB7uLmuFNZgkctnZNfAnbe2L9~meQStYSInvAiBa9pnTdJTDxD0ttw635FMClWTTtBWOrbG1p4fe5vprDBnFJQLRFEB~weA72Q__&Key-Pair-Id=K2YEDJLVZ3XRI"
                  alt=""
                  className="w-8 h-8"
                />
                Start group chat
              </button>
            </div>
          )} */}
        </div>
        <table className="table ">
          <tbody>
            {users.length > 0 &&
              users.map((x, i) => (
                <SingleUser
                  key={i}
                  singleUser={x}
                  checked={!!checkedUsers[x.username]}
                  handleCheckboxChange={(isChecked) =>
                    handleCheckboxChange(x.username, isChecked)
                  }
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllUsersPage;
