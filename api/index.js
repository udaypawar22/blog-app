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
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
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
const bucket = "mern-blogger-app";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const uploadMiddleware = multer({ storage: storage });
const jwtSecret = process.env.JWT_SECRET;
const bcryptSalt = bcrypt.genSaltSync(10);

mongoose.connect(process.env.MONGO_URL);

async function uploadToS3(file) {
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });

  const { path, mimetype, filename } = file;

  const data = await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: filename,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );

  return filename;
}

app.get("/api/test", (req, res) => {
  res.json("ok");
});

app.post("/api/register", async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    await User.create({
      userName,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.status(200).json("OK");
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
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
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/api/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      try {
        const userDoc = await User.findOne({ _id: userData.userId });
        res.status(200).json(userDoc);
      } catch (error) {
        res.status(500).json(error);
      }
    });
  } else {
    res.status(404).json(null);
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

  if (!file) {
    res.status(400).json("No file selected");
  } else {
    try {
      const newFileName = await uploadToS3(file);
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
  }
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
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        res.status(401).json({ error: "Unauthorized" });
      } else {
        try {
          const postDoc = await Post.findOne({ _id: postId });
          if (file && file !== postDoc.cover) {
            newFileName = await uploadToS3(file);
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
