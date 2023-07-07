import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // const newUser = new UserModel({
    //     username: req.body.username,
    //     password: hashedPassword,
    //     firstname: req.body.firstname,
    //     lastname: req.body.lastname});
    req.body.password = hashedPassword;
    const newUser = new UserModel(req.body);
    const {username} = req.body;

    try {
        const oldUser = await UserModel.findOne({username: username});
        if(oldUser) 
        {
            return res.status(400).json("User already exists");
        }
        
        const user = await newUser.save();

        const token = jwt.sign({username: user.username, id: user._id}, process.env.JWT_KEY, {expiresIn: "1h"});
        res.status(200).json({user,token});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

export const loginUser = async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await UserModel.findOne({username: username});
        if(user)
        {
            const validated = await bcrypt.compare(password, user.password);
            // validated? res.status(200).json(user) : res.status(400).json("Wrong password");
            if(!validated)
            {
                res.status(400).json("Wrong password");
            }
            else{
                const token = jwt.sign({username: user.username, id: user._id}, process.env.JWT_KEY, {expiresIn: "1h"});
                res.status(200).json({user,token});
            }
        }
        else{
            res.status(404).json("User not found");
        }
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
}