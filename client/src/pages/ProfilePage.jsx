import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/UserContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingAnimation from "../components/LoadingAnimation";

export default function ProfiilePage() {
  const navigate = useNavigate();
  const { setUser, user, loading: contextLoading } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios
        .get(`/post?data=${user}`)
        .then((response) => {
          const { data } = response;
          setPosts(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  function logout() {
    axios.post("/logout").then((response) => {
      if (response.data) {
        setUser(null);
        navigate("/");
      }
    });
  }

  if (contextLoading || loading) {
    return <LoadingAnimation />;
  }
  if (!user) {
    navigate("/login");
  }

  return (
    <div className="pt-20 px-12 lg:px-36 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl md:text-5xl text-gray-400 font-bold w-fit">
          {user}
        </h1>
        <div className="flex gap-2">
          <Link
            to={"/profile/create"}
            className="flex gap-1 items-center text-darkblue py-2 px-3 rounded-full border border-gray-400 shadow-md hover:bg-darkblue hover:text-white"
          >
            <span className="text-lg">New</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </Link>
          <button
            onClick={logout}
            className="flex gap-1 items-center text-darkblue py-2 px-3 rounded-full border border-gray-400 shadow-md hover:bg-darkblue hover:text-white"
          >
            <span className="text-lg">Logout</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-7 h-7"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="pt-10 pb-8 grid gap-y-8">
        {posts.length > 0 &&
          posts.map((post) => (
            <Link to={`/${post._id}`} className="shadow">
              <div className="w-full relative">
                <motion.button
                  className="absolute top-2 right-2 text-white p-2"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={(event) => {
                    event.preventDefault();
                    navigate(`/profile/edit/${post._id}`);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-7 h-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </motion.button>
                <div className="absolute top-3/4 w-full">
                  <h1 className="ml-10 w-3/4 py-2 lg:w-1/4 text-4xl font-medium text-white truncate italic">
                    {post.title}
                  </h1>
                </div>
                <img
                  className="w-full h-[300px] lg:h-[500px] object-cover aspect-square"
                  src={"http://localhost:4000/uploads/" + post.cover}
                  alt=""
                />
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}
