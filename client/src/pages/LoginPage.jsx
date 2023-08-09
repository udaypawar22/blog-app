import { Link, Navigate } from "react-router-dom";
import coverimg from "../assets/coverimage.jpg";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../components/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser, user } = useContext(UserContext);

  if (user) {
    return <Navigate to={"/"} />;
  }

  async function handleLogin(ev) {
    ev.preventDefault();
    const { data } = await axios.post("/login", { email, password });
    setUser(data.userName);
    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <div className="relative">
        <div className="mx-8">
          <h1 className="text-white text-3xl font-semibold absolute top-2/3 leading-normal">
            <i>
              "Your Thoughts, Your Voice, Our Platform - Blogging Made
              Beautiful!"
            </i>
          </h1>
        </div>
        <img className="object-cover aspect-square" src={coverimg} alt="" />
      </div>
      <div className="flex items-center p-32 relative">
        <Link
          to={"/"}
          className="w-fit flex gap-1 items-center absolute top-8 left-4 text-gray-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          <span>Back</span>
        </Link>
        <div className="w-full">
          <div className="mb-6">
            <h1 className="text-3xl mb-2 font-medium">Account Login</h1>
            <h3 className="text-gray-600">
              If you are already a member you can login with your email address
              and password
            </h3>
          </div>
          <form onSubmit={handleLogin}>
            <h3 className="text-gray-500 text-sm">Email address</h3>
            <input
              type="email"
              placeholder="johndoe@gmail.com"
              onChange={(ev) => setEmail(ev.target.value)}
            />
            <h3 className="text-gray-500 text-sm mt-4">Password</h3>
            <input
              type="password"
              onChange={(ev) => {
                setPassword(ev.target.value);
              }}
            />

            <h3 className="mt-4 w-fit mx-auto text-gray-500">
              Dont have an accout?{" "}
              <Link to={"/signup"} className="cursor-pointer text-darkblue">
                Sign up here
              </Link>
            </h3>

            <button className="mt-8 w-full text-center text-md font-medium text-white bg-darkblue py-3 rounded-md">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
