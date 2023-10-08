import React, { useEffect } from 'react'
import { useContext ,useState } from 'react'
import ChatContext from '../Context/ChatProvider'
import { FormControl, IconButton, Spinner , Input} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender ,getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import { Box , Text  } from '@chakra-ui/react';
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal"
import axios from 'axios';
import { useToast } from '@chakra-ui/react';
import "./styles.css";
import ScrollableChat from './ScrollableChat';
import Typing from './Typing';
import io from "socket.io-client"




const ENDPOINT = "http://localhost:5000";

var socket , selectedChatCompare;

const SingleChat = ({fetchAgain , setFetchAgain }) => {
    const { user ,selectedChat ,setSelectedChat ,notification , setNotification} = useContext(ChatContext);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected , setsocketConnected] = useState(false);
    const[typing,setTyping] = useState(false);
    const [isTyping , setisTyping] = useState(false);
    
    const toast = useToast();



      const fetchMessages = async() => {
        if(!selectedChat) return;

        try {
          
          const config = {
            headers: {

              Authorization: `Bearer ${user.token}`,
            },
          };

          setLoading(true);
          const { data } = await axios.get(`api/message/${selectedChat._id}`,
          config
          );

          // console.log(messages);
          setMessages(data);
          setLoading(false);

          socket.emit('join chat',selectedChat._id);

        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
          });
        }
      };


    const sendMessage = async(event) =>{
      if(event.key === "Enter" && newMessage){
        socket.emit("stop typing",selectedChat._id);
        try {
          
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          
          setNewMessage("");

          const {data} = await axios.post(`/api/message`,{
            content: newMessage,
            chatId: selectedChat._id
          },config);
          // console.log(data);

          socket.emit('new message',data);
          console.log(selectedChat);
          setMessages([...messages, data]);
          setSelectedChat(selectedChat);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom"
          });
        }
      }

    };

    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup" , user);
      socket.on("connected", ()=> setsocketConnected(true));
      socket.on('typing',()=> setisTyping(true));
      socket.on("stop typing", () => setisTyping(false));
     },[]);


     useEffect(()=>{
      fetchMessages();

      selectedChatCompare = selectedChat;
    },[selectedChat]);

    
// console.log(notification,"---------");
    useEffect(() => {
      socket.on("message recieved",(newMessageRecieved)=> {
        if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
          //give notification
          if(!notification.includes(newMessageRecieved)){
            setNotification([newMessageRecieved, ...notification]);
            setFetchAgain(!fetchAgain);
          }
        }
        else{
          setMessages([...messages , newMessageRecieved]);
          // console.log(messages);
          setSelectedChat(selectedChat);
        }
      });
    },)


    const typingHandler = (e) => {
      setNewMessage(e.target.value);

      if(!socketConnected) return;
      if(!typing){
        setTyping(true);
        socket.emit("typing",selectedChat._id);
      }

      let lastTypingTime = new Date().getTime();
      var timerLength = 1000;
      setTimeout(() => {
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;

        if(timeDiff >= timerLength && typing){
          socket.emit("stop typing",selectedChat._id);
          setTyping(false);
        }
       }, timerLength);
    };

    
    
  return (
   <>
    {selectedChat ? (
        <> 
        <Text
         fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            >
          <IconButton 
            display={{base: "flex" ,md: "none" }}
            icon={<ArrowBackIcon />}
            onClick={()=> setSelectedChat("")}
          />

          {messages &&

            (!selectedChat.isGroupChat ? (
               <Box
               display="flex"
               justifyContent="space-between"
               >
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
               </Box>
          ) : (
            <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    // fetchMessages={fetchMessages}
                  />
                </>
          ))}
        </Text>
         <Box
         display="flex"
         flexDir="column"
         justifyContent="flex-end"
         p={3}
         bg="#E8E8E8"
         w="100%"
         h="100%"
         borderRadius="lg"
         overflowY="hidden"
         >
            {/* Messages Here */}
            {loading?(
              <Spinner 
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ): (
             <div>
              {/* msg */}
              <div className='message'>
               <ScrollableChat messages={messages} />

              </div>
             </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
           
           {isTyping?<div>
            <Typing />
           </div>:(<></>)}
           
           
            <Input 
              variant="filled"
              bg="E0E0E0"
              placeholder="Enter a message.."
              onChange={typingHandler}
              value={newMessage}
            />
            </FormControl>
         </Box>
        </>
    ): (
        <Box
         display="flex"
         alignItems="center"
         justifyContent="center"
         h="100%"
        >
         <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
         </Text>
        </Box>
    )}
   </>
  )
}

export default SingleChat