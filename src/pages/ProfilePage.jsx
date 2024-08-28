import { useNavigate } from "react-router-dom";
import mainStore from "../store/mainStore";
import { useEffect, useRef, useState } from "react";
import http from "../plugins/http";
import { socket } from "../plugins/sockets";

function ProfilePage() {
  const { user, setUser, token } = mainStore();
  const nav = useNavigate();
  const [avatarLoader, setAvatarLoader] = useState(false);
  const [check, setCheck] = useState(false);
  const [errorImg, setErrorImg] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const imageRef = useRef();
  const usernameRef = useRef();
  const passwordOldRef = useRef();
  const passwordNewOneRef = useRef();
  const passwordNewTwoRef = useRef();

  const loadingGif =
    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWtsZWNwb2MzcXd6Zmw4NDM5NW9oNTMwZXpnNW92bTc0czM0eTZ0dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjI6SIIHBdRxXI40/giphy.webp";

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }

    socket.on("profileImageUpdated", ({ userId, image }) => {
      if (userId === user.id) {
        setUser((prevUser) => ({ ...prevUser, image }));
      }
    });

    socket.on("usernameUpdated", ({ userId, username }) => {
      if (userId === user.id) {
        setUser((prevUser) => ({ ...prevUser, username }));
      }
    });

    return () => {
      socket.off("profileImageUpdated");
      socket.off("usernameUpdated");
    };
  }, [user, nav, setUser]);

  async function changeImage() {
    setAvatarLoader(true);
    setErrorImg("");

    const imageUrl = imageRef.current.value.trim();
    if (imageUrl === "") {
      setErrorImg("Please enter a valid image URL.");
      setAvatarLoader(false);
      return;
    }

    const data = {
      image: imageUrl,
      user: { id: user.id },
    };

    try {
      const res = await http.postAuth("/updateImage", data, token);
      if (res.error) {
        setErrorImg(res.message);
      } else {
        setUser(res.data);
        imageRef.current.value = "";
      }
    } catch (err) {
      console.error("Error updating image:", err);
      setErrorImg("Failed to update image. Please try again.", err);
    } finally {
      setTimeout(() => setAvatarLoader(false), 500);
    }
  }

  async function updateUsername() {
    const data = {
      username: usernameRef.current.value.trim(),
      user: { id: user.id },
    };

    try {
      const res = await http.postAuth("/updateUsername", data, token);
      if (res.error) {
        console.error("Server returned an error:", res.message);
        return setErrorName(res.message);
      }
      setUser(res.data);
      usernameRef.current.value = "";
    } catch (error) {
      console.error("Error updating username:", error);
      setErrorName("Failed to update username. Please try again.");
    }
  }

  function checkPasswords() {
    const newPasswordOne = passwordNewOneRef.current.value;
    const newPasswordTwo = passwordNewTwoRef.current.value;

    if (newPasswordOne !== newPasswordTwo) {
      setErrorPassword("Passwords do not match.");
      return;
    } else {
      setErrorPassword("All good");
      setCheck(true);
    }
  }

  async function updatePassword() {
    const oldPassword = passwordOldRef.current.value;
    const newPasswordOne = passwordNewOneRef.current.value;
    const newPasswordTwo = passwordNewTwoRef.current.value;
    const data = {
      oldPassword,
      newPasswordOne,
      newPasswordTwo,
      user: { id: user.id },
    };

    try {
      console.log("Data to be sent:", data);
      const res = await http.postAuth("/updatePassword", data, token);
      if (res.error) {
        console.error("Server returned an error:", res.message);
        return setErrorPassword(res.message);
      }
      setUser(res.data);
      if (passwordOldRef.current) passwordOldRef.current.value = "";
      if (passwordNewOneRef.current) passwordNewOneRef.current.value = "";
      if (passwordNewTwoRef.current) passwordNewTwoRef.current.value = "";
      setErrorPassword("Password changed successfully");
      nav("/login");
    } catch (error) {
      console.error("Error updating password:", error);
      setErrorPassword("Failed to update password. Please try again.");
    }
  }

  if (!user) return null;
  return (
    <div>
      <div className="text-2xl uppercase mt-10 mb-5 text-center">Profile</div>
      <div className="card bg-base-100 w-[80%] mx-auto shadow-xl">
        <div className="relative rounded-full w-60 h-60 mx-auto flex justify-center overflow-hidden hover:opacity-70 duration-200">
          {avatarLoader ? (
            <img
              src={loadingGif}
              alt="Loading..."
              className="rounded-full w-full h-full object-cover absolute top-0 left-0 right-0 bottom-0"
            />
          ) : (
            <img
              src={user.image}
              alt={`${user.username} profile picture`}
              className="rounded-full w-full h-full object-cover absolute top-0 left-0 right-0 bottom-0"
            />
          )}
        </div>
        <div className="card-body items-center text-center">
          <h2 className="card-title">{user.username}</h2>
          <div className="input-group mb-3 w-[100%]">
            {/* Username */}
            <div className="relative z-0 w-full mb-5 group flex">
              <input
                ref={usernameRef}
                type="text"
                name="floating_username"
                id="floating_username"
                className="block w-[80%] text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="floating_username"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
              >
                New username
              </label>
              <button
                className="btn btn-outline-secondary w-[40%]"
                type="button"
                onClick={updateUsername}
              >
                Change
              </button>
              {errorName && (
                <div className="text-red-500 mt-2">{errorName}</div>
              )}
            </div>
          </div>
          {/* Profile Image */}
          <div className="mt-4 flex w-[100%]">
            <div className="relative z-0 w-full mb-5 group flex">
              <input
                ref={imageRef}
                type="text"
                name="floating_imageUrl"
                id="floating_imageUrl"
                className="block w-[80%] text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="floating_imageUrl"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
              >
                Enter image URL
              </label>
              <button
                className="btn btn-outline-secondary w-[40%]"
                type="button"
                onClick={changeImage}
              >
                Change image
              </button>
              {errorImg && <div className="text-red-500 mt-2">{errorImg}</div>}
            </div>
          </div>

          {/* Modal for change password */}
          <button
            className="btn"
            onClick={() => document.getElementById("my_modal_2").showModal()}
          >
            Change paswword
          </button>
          {/* Modal */}
          <dialog id="my_modal_2" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              {/* Password Old*/}
              <div className="input-group mb-3 w-[100%]">
                <div className="relative z-0 w-full mb-5 group flex">
                  <input
                    ref={passwordOldRef}
                    type="text"
                    name="floating_password_old"
                    id="floating_password_old"
                    className="block w-[80%] text-sm h-10 text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="floating_password_old"
                    className="pl-3 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
                  >
                    Old password
                  </label>
                </div>
              </div>

              {/* Password New One*/}
              <div className="input-group mb-3 w-[100%]">
                <div className="relative z-0 h-10 w-full mb-5 group flex">
                  <input
                    ref={passwordNewOneRef}
                    type="text"
                    name="floating_password_new_one"
                    id="floating_password_new_one"
                    className="block w-[80%] text-sm h-12 text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="floating_password_new_one"
                    className="pl-3 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
                  >
                    New password
                  </label>
                </div>
              </div>
              {/* Password New Two */}
              <div className="relative z-0 w-full mb-5 group flex">
                <input
                  ref={passwordNewTwoRef}
                  type="text"
                  name="floating_password_new_two"
                  id="floating_password_new_two"
                  className="block w-[80%] text-sm h-12 text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="floating_password_new_two"
                  className="pl-3 peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
                >
                  Repeat new password
                </label>
              </div>
              <form method="dialog" className="modal-backdrop">
                {check ? (
                  <>
                    <button
                      className="btn btn-outline-secondary w-[40%]"
                      type="button"
                      onClick={updatePassword}
                    >
                      Confirm
                    </button>
                    {errorPassword && (
                      <div className="text-red-500 mt-2">{errorPassword}</div>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-outline-secondary w-[40%]"
                      type="button"
                      onClick={checkPasswords}
                    >
                      Check
                    </button>
                    {errorPassword && (
                      <div className="text-red-500 mt-2">{errorPassword}</div>
                    )}
                  </>
                )}
              </form>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
