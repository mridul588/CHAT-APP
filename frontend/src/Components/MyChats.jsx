import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import { Button } from "@chakra-ui/react";
import { useContext } from "react";
import ChatContext from "../Context/ChatProvider";


const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = useContext(ChatContext)
  const toast = useToast();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("https://giga-chat-wrb2.onrender.com/api/chat", config);
      // console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
   
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
     fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);


  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%"}}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "25px", md: "28px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            paddingX={{ base: "8px", md: "8px", lg: "12px" }}
            paddingY={{ base: "6px", md: "4px", lg: "6px" }} 
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
  <Stack overflowY="scroll">
    {chats.map((chat) => (
      <Box
        onClick={() => setSelectedChat(chat)}
        cursor="pointer"
        bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
        color={selectedChat === chat ? "white" : "black"}
        px={3}
        py={2}
        borderRadius="lg"
        key={chat._id}
      >
        <Text>
          {!chat.isGroupChat
            ? chat.users[0]._id === loggedUser._id
              ? chat.users[1].name
              : chat.users[0].name
            : chat.chatName}
        </Text>
        {chat.latestMessage && (
          <Text fontSize="xs">
            <b>{chat.latestMessage.sender.name} : </b>
            {chat.latestMessage.content.length > 50
              ? chat.latestMessage.content.substring(0, 51) + "..."
              : chat.latestMessage.content}
          </Text>
        )}
      </Box>
    ))}
  </Stack>
) : (
  <ChatLoading />
)}

      </Box>
    </Box>
  );
};

export default MyChats;