import { createContext ,useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

export const ChatProvider = ({children}) => {
    const [user , setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats , setChats] = useState([]);
    const [notification , setNotification] = useState([]);

    // const navigate = useNavigate();

    useEffect(() => {
       const userInfo =JSON.parse(localStorage.getItem("userInfo"));
       setUser(userInfo);
    }, []);

    return(
        <ChatContext.Provider
        value={{user , setUser , selectedChat ,setSelectedChat ,chats ,setChats ,notification , setNotification}}
        >
            {children}
        </ChatContext.Provider>
    );
};

export default ChatContext;