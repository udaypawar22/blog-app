//udaysinghpawar0302
//TOtznt0zkWgbc8pF

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const User = require("./models/User");
const Post = require("./models/Post");
const app = express();

require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

const uploadMiddleware = multer({ dest: path.join(__dirname, "uploads") });
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

mongoose.connect(process.env.MONGO_URL);

function handlePhotos(file) {
  let newFileName = "";
  if (file) {
    const { originalname, path: filePath } = file;
    const split = originalname.split(".");
    const ext = split[split.length - 1];
    newFileName = Date.now() + "." + ext;
    const newPath = path.join(__dirname, "uploads", newFileName);
    fs.renameSync(filePath, newPath);
  } else {
    newFileName = "default.jpg";
  }
  return newFileName;
}

app.get("/api/test", (req, res) => {
  res.json("ok");
});

app.post("/api/register", async (req, res) => {
  const { userName, email, password } = req.body;
  const userDoc = await User.create({
    userName,
    email,
    password: bcrypt.hashSync(password, bcryptSalt),
  });
  res.status(200).json({ userDoc });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const result = bcrypt.compareSync(password, userDoc.password);
    if (result) {
      jwt.sign({ userId: userDoc._id }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res
          .cookie("token", token, { sameSite: "none", secure: true })
          .json(userDoc);
      });
    } else {
      res.status(401).json("password is incorrect");
    }
  } else {
    res.status(404).json("user not found");
  }
});

app.get("/api/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const userDoc = await User.findOne({ _id: userData.userId });
      res.json(userDoc);
    });
  } else {
    res.json(null);
  }
});

app.post("/api/logout", (req, res) => {
  const { token } = req.cookies;

  if (token) {
    res.cookie("token", "").json("OK");
  }
});

app.post("/api/post", uploadMiddleware.single("file"), async (req, res) => {
  const data = req.body;
  const file = req.file;
  const { token } = req.cookies;
  let postDoc = {};
  let userId = "";

  if (token) {
    jwt.verify(token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;
      userId = userData.userId;
    });
  }

  const newFileName = handlePhotos(file);

  try {
    postDoc = await Post.create({
      title: data.title,
      summary: data.summary,
      content: data.content,
      cover: newFileName,
      class: data.class,
      author: userId,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
  return res.status(201).json("OK");
});

app.get("/api/post", async (req, res) => {
  const urlData = req.query.data;
  if (urlData) {
    if (
      urlData === "sports" ||
      urlData === "entertainment" ||
      urlData === "lifestyle"
    ) {
      try {
        const categoryPosts = await Post.find({ class: urlData });
        res.status(201).json(categoryPosts);
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      const { token } = req.cookies;
      if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, userData) => {
          if (err) {
            res.status(401).json({ error: "Unauthorized" });
          } else {
            try {
              const authorPosts = await Post.find({
                author: userData.userId,
              }).sort({ createdAt: -1 });
              res.status(201).json(authorPosts);
            } catch (error) {
              res.status(500).json(error);
            }
          }
        });
      }
    }
  } else {
    try {
      const allPosts = await Post.find();
      res.status(200).json(allPosts);
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

app.put("/api/post", uploadMiddleware.single("file"), (req, res) => {
  const { token } = req.cookies;
  const postId = req.query.data;
  const data = req.body;
  const file = req.file;
  let newFileName = "";
  console.log(postId);
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        res.status(401).json({ error: "Unauthorized" });
      } else {
        try {
          const postDoc = await Post.findOne({ _id: postId });
          if (file && file !== postDoc.cover) {
            newFileName = handlePhotos(file);
          } else {
            newFileName = postDoc.cover;
          }
          if (userData.userId === postDoc.author.toString()) {
            postDoc.set({
              title: data.title,
              summary: data.summary,
              content: data.content,
              cover: newFileName,
              class: data.class,
            });
            await postDoc.save();
            res.json("OK");
          }
        } catch (error) {
          res.status(500).json(error);
        }
      }
    });
  }
});

app.get("/api/blog-post/:id?", async (req, res) => {
  const { id } = req.params;
  const key = req.query.data;
  if (key) {
    const regex = new RegExp(key.toLowerCase(), "i");
    return res.json(
      await Post.findOne({
        title: { $regex: regex },
      })
    );
  }
  try {
    const postDoc = await Post.findOne({ _id: id }).populate({
      path: "author",
      select: "_id userName email",
    });
    if (postDoc) {
      res.json(postDoc);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(4000);
