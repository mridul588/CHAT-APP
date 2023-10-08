//chatname
//isGroupChat
//user
//latestMessage
//groupAdmin

import mongoose from "mongoose";

export const chatModel = mongoose.Schema({
    chatName: {type: String ,trim: true},
    isGroupChat: {type: Boolean ,default: false},
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
    },

    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, 
    { 
        timestamps: true,
}
);

const Chat = mongoose.model("Chat",chatModel);

// module.exports = Chat;
export default Chat;