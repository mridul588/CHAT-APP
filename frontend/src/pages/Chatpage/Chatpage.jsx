import { useContext, useState } from "react";
import ChatContext from "../../Context/ChatProvider";
import { SideDrawer } from "../../Components/miscellaneous/SideDrawer";
import MyChats from "../../Components/MyChats";
import ChatBox from "../../Components/ChatBox";

import { Box } from "@chakra-ui/react";

export const Chatpage = () => {
  const { user } = useContext(ChatContext);

  const[fetchAgain , setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
          {user && <SideDrawer/>} 
         <Box
           display="flex"
           justifyContent='space-between'
           w='100%'
           h='91.5vh'
           p='10px'
         >
          {user && <MyChats
            fetchAgain={fetchAgain} 
          />} 
          {user && <ChatBox
            fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}
          />}
         </Box>
    </div>
  )
}