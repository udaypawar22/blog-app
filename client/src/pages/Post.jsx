import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import createbanner from "../assets/createblogbanner.jpg";
import editbanner from "../assets/editbanner.jpg";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import LoadingAnimation from "../components/LoadingAnimation";

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
};
const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
];

export default function Post() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState("");
  const [selectedOption, setSelectedOption] = useState("sports");
  const [otherBtn, setOtherBtn] = useState(false);
  const [otherInfo, setOtherInfo] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    axios
      .get(`/blog-post/${id}`)
      .then((response) => {
        const { data } = response;
        setTitle(data.title);
        setSummary(data.summary);
        setContent(data.content);
        setFile(data.cover);

        if (
          data.class === "sports" ||
          data.class === "entertainment" ||
          data.class === "lifestyle"
        ) {
          setSelectedOption(data.class);
        } else {
          setOtherBtn(true);
          setOtherInfo(data.class);
          setSelectedOption("other");
        }
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
  }, [id]);

  if (loading) {
    return <LoadingAnimation />;
  }

  async function createPost(formData) {
    let response = {};
    try {
      response = await toast.promise(axios.post("/post", formData), {
        pending: "Processing...",
        success: "Successful",
        error: "Failed",
      });
      if (response.data === "OK") {
        setTitle("");
        setSummary("");
        setContent("");
        setFile("");
        setSelectedOption("sports");
      }
    } catch (error) {
      toast.error(error.response.data, {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }

  async function editPost(formData) {
    const { data } = await toast.promise(
      axios.put(`/post?data=${id}`, formData),
      {
        pending: "Processing...",
        success: "Updated successfully",
        error: "A problem occurred",
      }
    );
    if (data === "OK") {
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }
  }

  function handlePost(ev) {
    ev.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("summary", summary);
    formData.append("content", content);
    formData.append("file", file[0]);
    if (selectedOption === "other") {
      formData.append("class", otherInfo);
    } else {
      formData.append("class", selectedOption);
    }

    if (!id) {
      createPost(formData);
    } else {
      editPost(formData);
    }
  }

  const handleRadioChange = (ev) => {
    const value = ev.target.value;
    setSelectedOption(value);

    if (value === "other") {
      setOtherBtn(true);
    } else {
      setOtherBtn(false);
      setOtherInfo("");
    }
  };

  return (
    <div className="min-h-screen">
      <div className="relative">
        <div className="absolute top-1/4 w-full text-center">
          <h1 className="text-5xl font-medium text-white">
            {id ? "Edit your blog post" : "Create your blog post"}
          </h1>
        </div>
        <img
          className="w-full h-[300px] lg:h-[500px] object-cover aspect-square"
          src={id ? editbanner : createbanner}
          alt=""
        />
      </div>
      <form onSubmit={handlePost} className="pt-14 px-12 min-h-screen">
        <label className="mb-2 text-gray-500 flex gap-1 px-10 w-fit py-4 border rounded-md cursor-pointer">
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
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
          upload photo
          <input
            type="file"
            className="hidden"
            onChange={(ev) => setFile(ev.target.files)}
          />
        </label>
        <input
          onChange={(ev) => setTitle(ev.target.value)}
          value={title}
          className="mb-2"
          type="text"
          placeholder="title"
        />
        <input
          onChange={(ev) => setSummary(ev.target.value)}
          value={summary}
          className="mb-4"
          type="summary"
          placeholder="summary"
        />
        <ReactQuill
          onChange={(ev) => setContent(ev)}
          value={content}
          modules={modules}
          formats={formats}
        />
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <label className="flex gap-1 items-center py-5 px-2 border rounded-md w-full text-sm">
            <input
              type="radio"
              name="r1"
              value="sports"
              checked={selectedOption === "sports" ? true : false}
              onChange={handleRadioChange}
            />
            <span>Sports</span>
          </label>
          <label className="flex gap-1 items-center py-5 px-2 border rounded-md w-full text-sm">
            <input
              type="radio"
              name="r1"
              value="entertainment"
              checked={selectedOption === "entertainment" ? true : false}
              onChange={handleRadioChange}
            />
            <span>Entertainment</span>
          </label>
          <label className="flex gap-1 items-center py-5 px-2 border rounded-md w-full text-sm">
            <input
              type="radio"
              name="r1"
              value="lifestyle"
              checked={selectedOption === "lifestyle" ? true : false}
              onChange={handleRadioChange}
            />
            <span>Lifestyle</span>
          </label>
          <label className="flex gap-1 items-center py-5 px-2 border rounded-md w-full text-sm">
            <input
              type="radio"
              name="r1"
              value="other"
              checked={selectedOption === "other" ? true : false}
              onChange={handleRadioChange}
            />
            <span>Other</span>
          </label>
          {otherBtn && (
            <input
              type="text"
              placeholder="add post type..."
              value={otherInfo}
              onChange={(ev) => setOtherInfo(ev.target.value)}
            />
          )}
        </div>

        <button className="mt-4 bg-darkblue mx-auto py-3 px-10 text-white rounded-md text-md font-medium">
          {id ? "Save post" : "Create post"}
        </button>
      </form>
      <ToastContainer autoClose={2000} />
    </div>
  );
}
