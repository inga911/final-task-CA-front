import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import mainStore from "../store/mainStore";

function SingleUser({ singleUser }) {
  const nav = useNavigate();
  const { user } = mainStore();

  function getUser(singleUser) {
    console.log(singleUser);
    nav(`/user/${singleUser.username}`);
  }
  return (
    <div
      className="user d-flex flex-column gap-2"
      style={{ cursor: "pointer" }}
    >
      <img src={singleUser.image} alt="" className="w-44 h-44 object-cover" />
      <h4 className="ms-3">{singleUser.username}</h4>
      <div>
        {user?.username === singleUser.username ? (
          "YOU"
        ) : (
          <button
            className="start-chat-btn"
            onClick={() => getUser(singleUser)}
          >
            Start conversation
          </button>
        )}
      </div>
    </div>
  );
}

// Proptypes
SingleUser.propTypes = {
  singleUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
};

export default SingleUser;
