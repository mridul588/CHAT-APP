import React, { useState } from 'react'
import { Box , Text } from "@chakra-ui/layout";
import { Menu , MenuButton , MenuDivider, MenuList, Tooltip , MenuItem, Input, useToast } from "@chakra-ui/react";
// import { BellIcon , ChevronDownIcon , Search2Icon } from "@chakra-ui/icon";
import { PhoneIcon, AddIcon, WarningIcon,SearchIcon,BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { Button } from "@chakra-ui/button";
import { Avatar } from "@chakra-ui/avatar";
import ChatContext from '../../Context/ChatProvider';
import { useContext } from 'react';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/hooks';
import ChatLoading from '../ChatLoading';
import UserList from '../UserAvatar/UserList';
import axios from 'axios';
import { Spinner } from '@chakra-ui/spinner';
import { getSender } from '../../config/ChatLogics';

export const SideDrawer = () => {

  const { user , setSelectedChat , chats , setChats , notification , setNotification} = useContext(ChatContext);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);


  const { isOpen, onOpen, onClose } = useDisclosure();

const navigate = useNavigate();

  const logoutHandler = async() => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

const toast = useToast();

const handleSearch = async () => {
  if (!search) {
    toast({
      title: "Please Enter something in search",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "top-left",
    });
    return;
  }

  try {
    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.get(`/api/user?search=${search}`, config);

    setLoading(false);
    setSearchResult(data);
  } catch (error) {
    console.log(error);
    toast({
      title: "Error Occured!",
      description: "Failed to Load the Search Results",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};



const accessChat = async (userId) => {
  console.log(userId);

  try {
    setLoadingChat(true);
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    const { data } = await axios.post(`/api/chat`, { userId }, config);

    if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
    setSelectedChat(data);
    setLoadingChat(false);
    onClose();
  } catch (error) {
    toast({
      title: "Error fetching the chat",
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left",
    });
  }
};

  return (
    <div>
       <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
          {/* <i class="fas fa-search" ></i> */}
            {/* <Search2Icon /> */}
            <SearchIcon/>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          Giga Chat
        </Text>
        <div>

            <Menu>
               <MenuButton p={1}>
               
                 <BellIcon  fontSize="2xl" m={1} />
            
               </MenuButton>

               <MenuList p={1}>
                {!notification.length && "No New Messages"}
                {notification.map(notif => (
                  <MenuItem key={notif._id} onClick={() =>{
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n)=> n !== notif))
                  }}
                  >
                      {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`:`New Message from ${getSender(user , notif.chat.users)}`}
                  </MenuItem>
                ))}
               </MenuList>
            </Menu>

              <Menu>
                 <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    <Avatar size="sm" cursor="pointer" name={user.name}  src={user.pic} />
                 </MenuButton>
                 <MenuList>
                    <ProfileModal user={user}>
                   <MenuItem>MY Profile</MenuItem>
                   </ProfileModal>
                   <MenuDivider />
                   <MenuItem onClick={logoutHandler}>Log Out</MenuItem>
                  
                 </MenuList>
              </Menu>

        </div>
        </Box>
        
        <Drawer placement='left' onClose={onClose}
        isOpen={isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottom="1px">Search Users</DrawerHeader>
            <DrawerBody>
            <Box display="flex" p={2}>

              <Input 
                _placeholder="Search by name or Email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
               onClick={handleSearch}> 
              
               Go </Button>
            </Box>
            {loading ? 
              <ChatLoading />
             : 
             (
              searchResult?.map(user => (
                <UserList  
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
             )
            }
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
          </DrawerContent>

         
        </Drawer>
        
    </div>
  )
}
