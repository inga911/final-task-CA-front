import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import mainStore from "../store/mainStore";

function SingleUser({ singleUser, checked, handleCheckboxChange }) {
  const nav = useNavigate();
  const { user } = mainStore();

  function getUser(singleUser) {
    nav(`/user/${singleUser.username}`);
  }

  return (
    <tr className="border-0 hover:bg-slate-100/50 transition-all">
      {user?.username !== singleUser.username && (
        <>
          <th className="w-10">
            <label>
              <input
                type="checkbox"
                className="checkbox"
                checked={checked}
                onChange={(e) => handleCheckboxChange(e.target.checked)}
              />
            </label>
          </th>
          <td>
            <div className="flex items-center gap-3">
              <div className="avatar">
                <div className="mask mask-squircle h-12 w-12">
                  <img
                    src={singleUser.image}
                    alt="Avatar Tailwind CSS Component"
                    className="cursor-pointer"
                    onClick={() => getUser(singleUser)}
                  />
                </div>
              </div>
              <div>
                <div
                  className="font-bold cursor-pointer hover:underline min-w-20"
                  onClick={() => getUser(singleUser)}
                >
                  {singleUser.username}
                </div>
              </div>
              <div className="flex gap-2 items-center cursor-pointer hover:underline hover:text-blue-800">
                <div
                  className="tooltip"
                  data-tip="Start chat"
                  onClick={() => nav(`/chat/${singleUser.username}`)}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/6187/6187333.png"
                    alt=""
                    className="w-5 h-5"
                  />
                </div>
              </div>
            </div>
          </td>
        </>
      )}
    </tr>
  );
}

// Proptypes
SingleUser.propTypes = {
  singleUser: PropTypes.shape({
    username: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  checked: PropTypes.bool.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
};

export default SingleUser;
