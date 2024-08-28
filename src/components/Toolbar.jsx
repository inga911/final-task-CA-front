import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import mainStore from "../store/mainStore";
import { useState } from "react";

function Toolbar() {
  const { user, setUser, setToken } = mainStore();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const nav = useNavigate();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    nav("/");
  }

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 relative">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-8" alt="Flowbite Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            ChatMe
          </span>
        </a>
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-user"
        >
          {user && (
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  to="/"
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/all-users"
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                >
                  All users
                </Link>
              </li>
              <li>
                <Link
                  to="/conversations"
                  className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                >
                  Conversations
                </Link>
              </li>
            </ul>
          )}
        </div>
        <div className="flex items-center gap-3 md:order-2">
          <div className="hidden md:flex gap-3">
            {!user && <Link to="/login">Login</Link>}
            {!user && <Link to="/register">Register</Link>}
          </div>
          {user && (
            <div className="flex items-center gap-3">
              <span className="block text-sm text-gray-900 dark:text-white">
                {user.username}
              </span>

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="rounded-full border-2 border-blue-400">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={user.image}
                      alt="user photo"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link to={"/profile"} className="justify-between">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <div onClick={logout}>Logout</div>
                  </li>
                </ul>
              </div>
            </div>
          )}
          {/* SMALL SCREEN NAV LINKS */}
          <div className="md:hidden drawer drawer-end z-10 w-5">
            <input
              id="my-drawer-4"
              type="checkbox"
              className="drawer-toggle"
              checked={isDrawerOpen}
              onChange={toggleDrawer}
            />
            <label
              htmlFor="my-drawer-4"
              className="cursor-pointer drawer-button hover:text-blue-500 transition-all"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </label>

            <div className="drawer-side">
              <label
                htmlFor="my-drawer-4"
                aria-label="close sidebar"
                className="drawer-overlay"
                onClick={closeDrawer}
              ></label>
              <div className="absolute top-4 right-10 z-20">
                {isDrawerOpen && (
                  <svg
                    fill="#000000"
                    width="25px"
                    height="25px"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={closeDrawer}
                    className="cursor-pointer hover:fill-blue-600 transition-all"
                  >
                    <path d="M20.48 3.512c-2.172-2.171-5.172-3.514-8.486-3.514-6.628 0-12.001 5.373-12.001 12.001 0 3.314 1.344 6.315 3.516 8.487 2.172 2.171 5.172 3.514 8.486 3.514 6.628 0 12.001-5.373 12.001-12.001 0-3.314-1.344-6.315-3.516-8.487zm-1.542 15.427c-1.777 1.777-4.232 2.876-6.943 2.876-5.423 0-9.819-4.396-9.819-9.819 0-2.711 1.099-5.166 2.876-6.943 1.777-1.777 4.231-2.876 6.942-2.876 5.422 0 9.818 4.396 9.818 9.818 0 2.711-1.099 5.166-2.876 6.942z" />
                    <path d="M13.537 12l3.855-3.855c.178-.194.287-.453.287-.737 0-.603-.489-1.091-1.091-1.091-.285 0-.544.109-.738.287l.001-.001-3.855 3.855-3.855-3.855c-.193-.178-.453-.287-.737-.287-.603 0-1.091.489-1.091 1.091 0 .285.109.544.287.738l-.001-.001 3.855 3.855-3.855 3.855c-.218.2-.354.486-.354.804 0 .603.489 1.091 1.091 1.091.318 0 .604-.136.804-.353l.001-.001 3.855-3.855 3.855 3.855c.2.218.486.354.804.354.603 0 1.091-.489 1.091-1.091 0-.318-.136-.604-.353-.804l-.001-.001z" />
                  </svg>
                )}
              </div>
              <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 py-10">
                {!user ? (
                  <div>
                    <li>
                      <Link to="/login" onClick={closeDrawer}>
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link to="/register" onClick={closeDrawer}>
                        Register
                      </Link>
                    </li>
                  </div>
                ) : (
                  <>
                    <li>
                      <Link to="/" onClick={closeDrawer}>
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link to="/all-users" onClick={closeDrawer}>
                        All users
                      </Link>
                    </li>
                    <li>
                      <Link to="/conversations" className="">
                        Conversations
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Toolbar;
