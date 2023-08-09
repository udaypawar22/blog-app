import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

export default function BlogPage() {
  const { id } = useParams();
  const [postData, setPostData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get(`/blog-post/${id}`)
      .then((response) => {
        const data = response.data;
        if (data) {
          setPostData(data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);
  if (loading) {
    return "loading";
  }
  return (
    <div className="pt-20 px-12 md:px-36 min-h-screen">
      <div className="w-full">
        <img
          className="w-full h-[500px] object-cover aspect-square"
          src={"http://localhost:4000/uploads/" + postData.cover}
          alt=""
        />
      </div>
      <div className="mt-8">
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-baseline">
            <h1 className="text-4xl font-medium w-fit">{postData.title}</h1>
            <div className="flex gap-1 items-center text-darkblue border px-3 py-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{postData.author.userName}</span>
            </div>
          </div>

          <span className="text-gray-500">
            {format(new Date(postData.createdAt), "dd.mm.yyyy")}
          </span>
        </div>
        {/* display author here */}
        <div className="mt-4 text-gray-500 lg:w-2/3">{postData.summary}</div>
        <div
          className="mt-6"
          dangerouslySetInnerHTML={{ __html: postData.content }}
        ></div>
      </div>
    </div>
  );
}
