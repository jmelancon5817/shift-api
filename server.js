import express from "express";
const app = express();
import cors from "cors";
import multer from "multer";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import mongoose from "mongoose";
mongoose.set("strictQuery", false);

const router = express.Router();

// import mongoose schemas
import User from "./models/user.js";
import Thumbnail from "./models/thumbnail.js";

// Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.send("Landing page");
});

app.get("/dashboard", (req, res) => {
  res.send("Dashboard");
});

app.get("/optimize", (req, res) => {
  res.send("Optimize");
});

app.post("/register", async (req, res) => {
  try {
    const { profileObj } = req.body;

    const newUser = new User({
      firstName: profileObj.given_name,
      lastName: profileObj.family_name,
      email: profileObj.email,
    });
    const user = await newUser.save();
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

app.post("/test", async (req, res) => {
  try {
    const profile = req.body;
    console.log(profile);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

// Thumbnails

app.post(
  "/api/users/:userId/thumbnails",
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log(req.body);
    try {
      const userId = req.params.userId;

      // access the files using req.files
      const image1 = req.body["image1"];
      const image2 = req.body["image2"];

      // You can use the `userId` and `images` to create a new `Thumbnail` object
      const thumbnail1 = new Thumbnail({ userId: userId, image: image1 });
      const thumbnail2 = new Thumbnail({ userId: userId, image: image2 });

      // Save the thumbnail to the database
      const savedThumbnail1 = await thumbnail1.save();
      const savedThumbnail2 = await thumbnail2.save();
      // Save the thumbnails IDs
      const thumbnailIds = [savedThumbnail1._id, savedThumbnail2._id];

      res
        .status(201)
        .json({ message: "Thumbnail uploaded successfully!", thumbnailIds });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

app.delete("/api/users/:userId/thumbnails/:thumbnailId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const thumbnailId = req.params.thumbnailId;

    // Find the thumbnail by ID and delete it
    await Thumbnail.findByIdAndDelete(thumbnailId);

    res.status(200).json({ message: "Thumbnail deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://jmelancon5817:mongoDBpassword@cluster0.ciz51e8.mongodb.net/users?retryWrites=true&w=majority"
    );

    app.listen(4000, () => {
      console.log("Server started on http://localhost:4000");
    });
  } catch (e) {
    console.log(e.message);
  }
};

start();

export default router;
