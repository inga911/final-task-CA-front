import { useRef } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../plugins/http";

function RegisterPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [repeatPasswordVisible, setRepeatPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleRepeatPasswordVisibility = () => {
    setRepeatPasswordVisible(!repeatPasswordVisible);
  };

  const usernameRef = useRef();
  const passOneRef = useRef();
  const passTwoRef = useRef();
  const nav = useNavigate();

  const [error, setError] = useState("");

  async function auth(event) {
    if (
      usernameRef.current.value.trim() === "" ||
      passOneRef.current.value.trim() === "" ||
      passTwoRef.current.value.trim() === ""
    ) {
      return setError("All fields required");
    }
    event.preventDefault();
    const user = {
      username: usernameRef.current.value,
      passwordOne: passOneRef.current.value,
      passwordTwo: passTwoRef.current.value,
    };
    const res = await http.post("/register", user);

    if (res.error) {
      return setError(res.message);
    } else {
      nav("/login");
    }
  }

  return (
    <div className="border-2 border-gray-700 shadow-lg w-[80%] sm:w-[70%] md:w-[50%] mx-auto mt-20 p-10 rounded-lg">
      <div className="uppercase text-center text-2xl py-5 font-semibold tracking-wider text-blue-700">
        Register
      </div>
      <form className="max-w-md mx-auto">
        <div className="relative z-0 w-full mb-5 group">
          <input
            ref={usernameRef}
            type="text"
            name="floating_username"
            id="floating_username"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_username"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
          >
            Username
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            ref={passOneRef}
            type={passwordVisible ? "text" : "password"}
            name="floating_password"
            id="floating_password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
          >
            Password
          </label>
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            <svg
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={
                  passwordVisible
                    ? "M2 12s3 7 10 7 10-7 10-7-3-7-10-7-10 7-10 7z"
                    : "M1.5 1.5l21 21M9.88 9.88a3 3 0 1 0 4.24 4.24m1.42-6.34A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                }
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            ref={passTwoRef}
            type={repeatPasswordVisible ? "text" : "password"}
            name="repeat_password"
            id="floating_repeat_password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="floating_repeat_password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-8 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-8"
          >
            Confirm Password
          </label>
          <button
            type="button"
            onClick={toggleRepeatPasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            <svg
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={
                  repeatPasswordVisible
                    ? "M2 12s3 7 10 7 10-7 10-7-3-7-10-7-10 7-10 7z"
                    : "M1.5 1.5l21 21M9.88 9.88a3 3 0 1 0 4.24 4.24m1.42-6.34A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"
                }
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>
        <div className="my-3 text-sm tracking-wider text-red-600">{error}</div>
        <button
          onClick={auth}
          type="submit"
          className="text-blue-700 uppercase tracking-widest transition-all hover:text-white border-2 border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full  px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mb-3"
        >
          Submit
        </button>
        <div className="text-sm text-gray-500">
          Have an account?{" "}
          <Link to="/login" className="italic text-blue-600">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
