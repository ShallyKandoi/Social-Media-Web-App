import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//get all users
export const getAllUsers = async (req, res) => {
    try {
        let users = await UserModel.find();

        users = users.map((user) => {
            const {password, ...otherDetails} = user._doc;
            return otherDetails;
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
};

//get user
export const getUser = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);

        if(user)
        {
            const {password, ...otherDetails} = user._doc;
            res.status(200).json(otherDetails);
        }
        else{
            res.status(404).json("User not found");
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

//update user
export const updateUser = async (req, res) => {
    const id = req.params.id; //id of user whose info is to be updated
    const {_id, currentUserAdmin, password} = req.body;

    if(_id === id)
    {
        try{

            if(password)
            {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password, salt);
            }

            const user = await UserModel.findByIdAndUpdate(id, req.body, {new: true});

            const token = jwt.sign(
                {username: user.username, id: user._id}, 
                process.env.JWT_KEY, 
                {expiresIn: "1h"}
            );

            res.status(200).json(user, token);
        }catch(error){
            res.status(500).json(error);
        }
    }
    else{
        res.status(403).json("Access Denied! You can update only your account");
    }
}    

//delete user
export const deleteUser = async (req, res) => {
    const id = req.params.id; //id of user whose account is to be deleted

    const {currentUserId, currentUserAdminStatus} = req.body;
    if(currentUserId===id || currentUserAdminStatus)
    {
        try{
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("Account has been deleted");
        }catch(error){
            res.status(500).json(error);
        }
    }
    else{
        res.status(403).json("Access Denied! You can delete only your account");
    }
}

//follow user
export const followUser = async (req, res) => {
    const id = req.params.id; //id of user to be followed
    const { _id } = req.body; //current user who is logged in

    if(_id !== id)
    {
        try{
            const user = await UserModel.findById(id);
            const currentUser = await UserModel.findById(_id);

            if(!user.followers.includes(_id))
            {
                await user.updateOne({$push: {followers: _id}});
                await currentUser.updateOne({$push: {following: id}});
                res.status(200).json("User has been followed");
            }
            else{
                res.status(403).json("You already follow this user");
            }
        }catch(error){
            res.status(500).json(error);
        }
    }
    else{
        res.status(403).json("You cannot follow yourself (Action forbidden)");
    }
}

//unfollow user
export const unfollowUser = async (req, res) => {
    const id = req.params.id; //id of user to be unfollowed
    const {_id} = req.body; //current user who is logged in

    if(_id !== id)
    {
        try{
            const user = await UserModel.findById(id);
            const currentUser = await UserModel.findById(_id);

            if(user.followers.includes(_id))
            {
                await user.updateOne({$pull: {followers: _id}});
                await currentUser.updateOne({$pull: {following: id}});
                res.status(200).json("User has been unfollowed");
            }
            else{
                res.status(403).json("You do not follow this user");
            }
        }catch(error){
            res.status(500).json(error);
        }
    }
    else{
        res.status(403).json("You cannot unfollow yourself (Action forbidden)");
    }
}