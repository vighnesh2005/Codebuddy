import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const checkToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) {
        console.warn("No token found in cookies");
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(401).json({ message: "Unauthorized" });
    }   
};
