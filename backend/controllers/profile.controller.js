import { uploadImage, deleteImage } from "../utils/cloudinary.js";
import  User  from "../models/user.model.js";
import { redis } from "../utils/redis.js";

export const getProfile = async (req, res) => {
    const { id } = req.body;
    try {
        let user = await redis.get(`user-${id}`);
        if (!user) {
        user = await User.findById(id).lean();
        await redis.set(`user-${id}`, JSON.stringify(user), { EX: 3600 });            
        }
        return res.status(200).json({ user: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { id, image , username, description } = req.body;
        const user = await User.findById(id);
        
        if(user.profile){
            const public_id = user.profile.split('/').pop().split('.')[0];
            await deleteImage(`uploads/${public_id}`);
        }
        
        const result = await uploadImage(image);
        
        user.profile = result.secure_url;
        user.username = username;
        user.description = description;
        await user.save();

        return res.status(200).json({user:user});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}