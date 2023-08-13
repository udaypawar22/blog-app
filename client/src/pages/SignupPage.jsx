import { Link, useNavigate } from "react-router-dom";
import coverimg from "../assets/animation_lktx2rbq.json";
import { useState } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import successGif from "../assets/animation_lkr62eqt.json";
import { ToastContainer, toast } from "react-toastify";

export default function SignupPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const navigate = useNavigate();

  async function registerUser(ev) {
    ev.preventDefault();
    await axios
      .post("/register", {
        userName,
        email,
        password,
      })
      .then(
        (result) => {
          if (result.data === "OK") {
            setIsSuccessful(true);
          }
        },
        (error) => {
          console.error(error);
          toast.error("username/email not available", {
            position: "top-right",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      );
  }
  if (isSuccessful) {
    setTimeout(() => {
      navigate(-1);
    }, 5000);
  }
  return (
    <div className={"grid grid-cols-1 lg:grid-cols-2 min-h-screen"}>
      <div className="flex items-center">
        <div className="mx-8">
          <Lottie animationData={coverimg} />
        </div>
      </div>
      {!isSuccessful && (
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
              <h1 className="text-3xl mb-2 font-medium">Account Signup</h1>
              <h3 className="text-gray-600">
                Become a member and start exploring!
              </h3>
            </div>
            <form onSubmit={registerUser}>
              <h3 className="text-gray-500 text-sm">User name</h3>
              <input
                type="text"
                placeholder="johndoe21"
                onChange={(ev) => setUserName(ev.target.value)}
              />

              <h3 className="text-gray-500 text-sm mt-4">Email address</h3>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                onChange={(ev) => setEmail(ev.target.value)}
              />

              <h3 className="text-gray-500 text-sm mt-4">Password</h3>
              <input
                type="password"
                onChange={(ev) => setPassword(ev.target.value)}
              />

              <h3 className="mt-4 w-fit mx-auto text-gray-500">
                Already have an accout?{" "}
                <Link to={"/login"} className="cursor-pointer text-darkblue">
                  Login here
                </Link>
              </h3>

              <button className="mt-8 w-full text-center text-md font-medium text-white bg-darkblue py-3 rounded-md">
                Signup
              </button>
            </form>
          </div>
        </div>
      )}
      {isSuccessful && (
        <div className="h-full w-full flex items-center">
          <div className="mx-auto py-32 text-center">
            <Lottie animationData={successGif} loop={false} />
            <h1 className="mt-2 text-2xl font-bold text-gray-500 mb-8">
              Success
            </h1>
          </div>
        </div>
      )}
      <ToastContainer autoClose={5000} />
    </div>
  );
}
