import User from "../model/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // const isMatch = await bcrypt.compare(password, user.password);
        // if (!isMatch) {
        //     return res.status(400).json({ msg: "Invalid credentials" });
        // }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ msg: "Login successful", token });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const create = async (req, res) => {
    try {

        const userData = new User(req.body);

        if (!userData) {
            return res.status(404).json({ msg: "User data not found" });
        }

        await userData.save();
        res.status(200).json({ msg: "User created successfully" });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}


export const getAll = async (req, res) => {
    try {

        const userData = await User.find();
        if (!userData) {
            return res.status(404).json({ msg: "User data not found" });
        }
        res.status(200).json(userData);

    } catch (error) {
        res.status(500).json({ error: error });
    }
}


export const getOne = async (req, res) => {
    try {

        const id = req.params.id;
        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json(userExist);

    } catch (error) {
        res.status(500).json({ error: error });
    }
}


export const update = async (req, res) => {
    try {

        const id = req.params.id;
        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(401).json({ msg: "User not found" });
        }

        const updatedData = await User.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({ msg: "User updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}


export const deleteUser = async (req, res) => {
    try {

        const id = req.params.id;
        const userExist = await User.findById(id);
        if (!userExist) {
            return res.status(404).json({ msg: "User not exist" });
        }
        await User.findByIdAndDelete(id);
        res.status(200).json({ msg: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error });
    }
}