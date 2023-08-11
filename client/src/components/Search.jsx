import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [item, setItem] = useState("");
  const navigate = useNavigate();
  async function handleSearch(ev) {
    ev.preventDefault();
    if (item) {
      const { data } = await axios.get(`/blog-post?data=${item}`);
      if (data) {
        setItem("");
        navigate(`/${data._id}`);
      }
    }
  }
  return (
    <div className="flex items-center border rounded-full w-[300px] px-2">
      <input
        type="text"
        value={item}
        className="search-box"
        onChange={(ev) => setItem(ev.target.value)}
      />
      <button className="p-2" onClick={handleSearch}>
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
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>
    </div>
  );
}
