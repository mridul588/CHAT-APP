import  express  from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage } from "../controllers/messageController.js";
import { allMessages } from "../controllers/messageController.js";


const router = express.Router()

router.route('/').post(protect,sendMessage)
router.route('/:chatId').get(protect,allMessages)

export default router