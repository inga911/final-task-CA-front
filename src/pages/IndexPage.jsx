import { Link } from "react-router-dom";

function IndexPage() {
  return (
    <div className="mt-52 w-[80%] mx-auto">
      <div className="flex w-full">
        <div className="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center">
          <span>Already have an account?</span>
          <Link to="/login">Login</Link>
        </div>
        <div className="divider divider-horizontal">OR</div>
        <div className="card bg-base-300 rounded-box grid h-20 flex-grow place-items-center">
          <span>Do not have an account?</span>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default IndexPage;
