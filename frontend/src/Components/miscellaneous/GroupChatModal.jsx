import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    FormControl,
    Box
  } from '@chakra-ui/react'
  import { useDisclosure } from '@chakra-ui/react'
  import { useToast } from '@chakra-ui/react'
  import { useContext } from 'react'
  import ChatContext from '../../Context/ChatProvider'
  import UserList from "../UserAvatar/UserList"
  import axios from 'axios'
  import UserBadgeItem from '../UserAvatar/UserBadgeItem'

const GroupChatModal = ({children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user , chats ,setChats} = useContext(ChatContext);
   
const handleSearch = async(query) => {
    setSearch(query);
    if(!query){
        return;
    }

    try {
        setLoading(true);

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        }
        const { data } = await axios.get(`/api/user?search=${search}`, config);
        // console.log(data);
        setLoading(false);
        setSearchResult(data);
  
    } catch (error) {
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
const handleSubmit = async() => {
    if(!groupChatName || !selectedUsers){
        toast({
            title: "PLease fill all fields",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
        return;
    }

    try {
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const {data} = await axios.post(`/api/chat/group`,{
            name: groupChatName,
            users: JSON.stringify(selectedUsers.map((u) => u._id)),

        },config);

        setChats([data , ...chats]);
        onClose();
        toast({
            title: "New Group Chat Created",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
    } catch (error) {
        console.log(error);
        toast({
            title: "Failed to Create the Chat",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
    }

};

const handleGroup = (userToAdd) => {
    if(selectedUsers.includes(userToAdd)){
        toast({
            title: "User already added",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
        });
        return;
    }
    setSelectedUsers([...selectedUsers , userToAdd]);
};
const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id))
};

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
          fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex" flexDir="column" alignItems="center"
          >
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            {loading ? (
              // <ChatLoading />
              <div>Loading...</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Close
            </Button>
           
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal