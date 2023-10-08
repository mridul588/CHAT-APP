import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { accessChat , fetchChat ,createGroupChat ,renameGroup ,addToGroup, removeFromGroup } from "../controllers/chatController.js";

const router = express.Router();

 router.route('/').post(protect, accessChat);
 router.route('/').get(protect, fetchChat);
 router.route('/group').post(protect, createGroupChat);
 router.route('/rename').put(protect, renameGroup);
 router.route('/remove').put(protect, removeFromGroup);
 router.route('/groupadd').put(protect, addToGroup);

export default router;