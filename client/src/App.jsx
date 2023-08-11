import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import axios from "axios";
import UserContextProvider from "./components/UserContext";
import ProfiilePage from "./pages/ProfilePage";
import Post from "./pages/Post";
import BlogPage from "./pages/BlogPage";
import ClassPage from "./pages/ClassPage";

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/profile" element={<ProfiilePage />} />
          <Route path="/profile/create" element={<Post />} />
          <Route path="/:id" element={<BlogPage />} />
          <Route path="/trends/:category" element={<ClassPage />} />
          <Route path="/profile/edit/:id" element={<Post />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
