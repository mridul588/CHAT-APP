import React, { useEffect } from 'react'
import { Container , Box ,Text ,
  Tabs, TabList, TabPanels, Tab, TabPanel ,
} from "@chakra-ui/react";

import {Login} from "../../Components/Authentication/Login";
import { Signup } from '../../Components/Authentication/Signup';
import { useNavigate } from 'react-router-dom';

export const Homepage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if(user) navigate("/chats");
  },[navigate]);

  return (
    <Container>
       <Box
       d='flex'
       justifyContent="Center"
       p={3}
       bg={"white"}
       w="100%"
       m="40px 0 15px 0"
       borderRadius="lg"
       borderWidth="1px"
       textAlign="center"
       >
      <Text fontSize="2xl"> GigaChat</Text>
       </Box>

       <Box bg="white" w="100%" p={4} borderRadius="lg" color="black"borderWidth="1px" >
       <Tabs variant='soft-rounded'>
  <TabList>
    <Tab>Log in</Tab>
    <Tab>Sign up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
     <Login />
    </TabPanel>
    <TabPanel>
      <Signup />
    </TabPanel>
  </TabPanels>
</Tabs>

       </Box>
    </Container>
  )
}
