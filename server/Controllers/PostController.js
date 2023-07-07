import PostModel from "../Models/postModel.js";
import mongoose from "mongoose";
import UserModel from "../Models/userModel.js";

//Create a post
export const createPost = async (req, res) => {
    const newPost = new PostModel(req.body);
    try {
        await newPost.save();
        res.status(201).json(newPost);
    } catch(error) {
        res.status(500).json(error); //500 is internal server error
    }
}

//Get a post
export const getPost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        res.status(200).json(post);
    } catch(error) {
        res.status(500).json(error);
    }
}

// Update a post
export const updatePost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.updateOne({$set: req.body});
            res.status(200).json("Post updated successfully");
        } else {
            res.status(403).json("You can update only your post");
        }
    } catch(error) {
        res.status(500).json(error);
    }
}

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if(post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("Post deleted successfully");
        } else {
            res.status(403).json("You can delete only your post");
        }
    } catch(error) {
        res.status(500).json(error);
    }
}

// Like/Dislike a post
export const likePost = async (req, res) => {
    try {
        const post = await PostModel.findById(req.params.id);
        if(!post.likes.includes(req.body.userId)) {
            await post.updateOne({$push: {likes: req.body.userId}});
            res.status(200).json("Post liked successfully");
        } else {
            await post.updateOne({$pull: {likes: req.body.userId}});
            res.status(200).json("Post disliked successfully");
        }
    } catch(error) {
        res.status(500).json(error);
    }
}

// Get timeline posts (includes user's posts and his friends' posts)
export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id;
    // const userId = req.body.userId;
    try {
        const currentUserPosts = await PostModel.find({userId: userId});
        const followingPosts = await UserModel.aggregate([
            {
                $match: {
                    _id : new mongoose.Types.ObjectId(userId) //_id is object id which is matched to the current user id
                }
            },
            {
                $lookup: {
                    from: "posts", //from is the collection name
                    localField: "following", //localField is the field in the current collection
                    foreignField: "userId", //foreignField is the field in the collection from which we are looking up
                    as: "followingPosts" //as is the name of the field in the output
                }
            },
            {
                $project: {
                    followingPosts: 1, //1 means true
                    _id: 0 //0 means false
                }
            }
        ]) 
        res.status(200).json(currentUserPosts.concat(...followingPosts[0].followingPosts)
        .sort((a, b) => {
            return b.createdAt - a.createdAt; //sorts the posts in descending order of their creation time (latest post first)
        }));

        // const currentUser = await PostModel.findById(req.body.userId);
        // const userPosts = await PostModel.find({userId: currentUser._id});
        // const friendPosts = await Promise.all(
        //     currentUser.followings.map((friendId) => {
        //         return PostModel.find({userId: friendId});
        //     })
        // );
        // res.status(200).json(userPosts.concat(...friendPosts));
    } catch(error) {
        res.status(500).json(error);
    }
}