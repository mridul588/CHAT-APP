import jwt from "jsonwebtoken"; // Import as 'jwt', not 'Jwt'
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
        expiresIn: "30d",
    });
};

export default generateToken;
