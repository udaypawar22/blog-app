import { useEffect, useState } from "react";
import img from "../assets/mainbg.jpg";
import axios from "axios";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("/post").then((response) => {
      console.log(response.data);
      setPosts(response.data);
    });
  }, []);
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
      <div className="grid grid-cols-4 gap-x-6 gap-y-12 px-12 pt-14 mb-6">
        {posts.length > 0 &&
          posts.map((post) => (
            <Link to={"/" + post._id}>
              <div className="w-full rounded-md overflow-hidden">
                <img
                  className="object-cover aspect-square"
                  src={"http://localhost:4000/uploads/" + post.cover}
                  alt=""
                />
              </div>
              <div className="mt-3">
                <h3 className="text-sm text-gray-500">
                  {format(new Date(post.createdAt), "dd.mm.yyyy")}
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
    </div>
  );
}
