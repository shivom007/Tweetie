import Post from "../models/Post.js";
import User from "../models/User.js";
import cloudinary from "cloudinary";
import DatauriParser from "datauri/parser.js";
import path from "path";
/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    // console.log(description)

    var img = "";
    var file = req.file;
    if (file !== undefined) {
      const parser = new DatauriParser();
      const ext = path.extname(file.originalname).toString();
      const uri = parser.format(ext, file.buffer);
      img = await cloudinary.v2.uploader.upload(uri.content);
      // console.log(img.secure_url);
    }
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      description: description,
      username: user.username,
      userPicturePath: user.picturePath,
      picturePath: img.secure_url || img,
      likes: {},
      comments: [],
    });

    await newPost.save();
    // console.log(newPost.description)
    const post = await Post.find();
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (req, res) => {
  try {
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    // console.log("catch block")
    res.status(404).json({ message: "how are you" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: "how are u" });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const descriptionUpdate = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, description } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (userId !== post.userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update post description" });
    }

    // Update the description
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { description: description },
      { new: true } // Return the updated post
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// DELETE
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    console.log(userId);
    const post = await Post.findById(postId);
    if (userId !== post.userId) return;
    await Post.deleteOne({ _id: postId });

    const updatedPost = await Post.find();

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
