import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';    
dotenv.config();

export const createToken = (user,res) => {
    const token = jsonwebtoken.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
    
    res.cookie('token', token, {
        httpOnly: true, 
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return token;
}