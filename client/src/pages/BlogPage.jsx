import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import LoadingAnimation from "../components/LoadingAnimation";
import RenderedContent from "../components/RenderedContent";

export default function BlogPage() {
  const { id } = useParams();
  const [postData, setPostData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      return;
    }
    setLoading(true);
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
  }, [id]);
  if (loading) {
    return <LoadingAnimation />;
  }
  return (
    <div className="pt-20 px-12 lg:px-36 min-h-screen">
      <div className="w-full">
        <img
          className="w-full h-[500px] object-cover aspect-square"
          src={import.meta.env.VITE_API_UPLOAD + postData.cover}
          alt=""
        />
      </div>
      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-medium w-fit">{postData.title}</h1>
          <div className="flex gap-3 items-center text-lg">
            <span className="text-darkblue">
              {"@" + postData.author.userName}
            </span>
            <span className="text-gray-500">
              {format(new Date(postData.createdAt), "dd.MM.yyyy")}
            </span>
          </div>
        </div>
        <div className="mt-4 text-gray-500 lg:w-2/3">{postData.summary}</div>
        <RenderedContent htmlContent={postData.content} />
      </div>
    </div>
  );
}
