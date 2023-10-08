import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";

dotenv.config();

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // console.log("Token:", token);

      // Decodes the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // console.log("Decoded:", decoded);

      // Find the user by ID and exclude the password field
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});
