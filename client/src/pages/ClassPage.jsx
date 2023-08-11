import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import sportsbanner from "../assets/sportsbanner.jpg";
import lifestylebanner from "../assets/lifestylebanner.jpg";
import entertainmentbanner from "../assets/entertainmentbanner.jpg";
import { format } from "date-fns";
import axios from "axios";
import LoadingAnimation from "../components/LoadingAnimation";

const bannerImages = {
  sports: sportsbanner,
  lifestyle: lifestylebanner,
  entertainment: entertainmentbanner,
};

export default function ClassPage() {
  const { category } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const bannerImage = bannerImages[category] || null;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/post?data=${category}`)
      .then((response) => {
        const { data } = response;
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, [category]);

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="min-h-screen">
      <div className="relative">
        <div className="absolute top-1/4 w-full text-center">
          <h1 className="text-5xl font-medium text-white">
            {category.toUpperCase()}
          </h1>
        </div>
        {bannerImage && (
          <img
            className="w-full h-[300px] lg:h-[500px] object-cover aspect-square"
            src={bannerImage}
            alt=""
          />
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 px-12 pt-14 mb-6">
        {posts.length > 0 &&
          posts.map((post) => (
            <Link to={`/${post._id}`}>
              <div className="w-full rounded-md overflow-hidden">
                <img
                  className="object-cover aspect-square"
                  src={"http://localhost:4000/uploads/" + post.cover}
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
    </div>
  );
}
