import { useEffect, useState } from "react";
import img from "../assets/mainbg.jpg";
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import LoadingAnimation from "../components/LoadingAnimation";
import EmptyVector from "../components/EmptyVector";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/post")
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Couldn't fetch data", {
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingAnimation />;
  }
  return (
    <div>
      <div className="relative">
        <div className="absolute top-1/4 w-full text-center">
          <h1 className="text-5xl font-medium text-white">
            Welcome to blogger
          </h1>
          <h3 className="text-2xl my-2 text-white">create • explore</h3>
        </div>
        <img className="w-full object-cover aspect-video" src={img} alt="" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 px-12 pt-14 mb-6">
        {posts.length > 0 &&
          posts.map((post) => (
            <Link to={"/" + post._id}>
              <div className="w-full rounded-md overflow-hidden">
                <img
                  className="object-cover aspect-square"
                  src={import.meta.env.VITE_API_UPLOAD + post.cover}
                  alt=""
                />
              </div>
              <div className="mt-3">
                <h3 className="text-sm text-gray-500">
                  {format(new Date(post.createdAt), "dd.MM.yyyy")}
                </h3>
                <h1 className="mt-4 text-2xl text-gray-700 font-serif">
                  {post.title}
                </h1>
                <p className="text-sm leading-5 mt-2 line-clamp-3 text-gray-500">
                  {post.summary}
                </p>
              </div>
            </Link>
          ))}
      </div>
      {posts.length === 0 && (
        <EmptyVector className={"min-h-screen items-center justify-center"} />
      )}
    </div>
  );
}
