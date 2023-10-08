import React ,{ useState } from 'react'
import { Button,InputGroup, FormControl, FormLabel, Input, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";



export const Login = () => {


  const[show,setShow] = useState(false);
  const[name,setName] = useState();
  const[email,setEmail] = useState();
  const[password ,setPassword] = useState();
  const[loading ,setLoading] = useState();
  
  const toast = useToast();
  const navigate = useNavigate();
const handleClick = () => setShow(!show);

const submitHandler = async() => {
  setLoading(true);
  if (!email || !password) {
    toast({
      title: "Please Fill all the Feilds",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
    return;
  }

  try {
    const config = { 
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post("http://localhost:5000/api/user/login",
    { email , password },
    config
    );

    toast({
      title: "login successfull",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setLoading(false);
    navigate("/chats");
  } catch (error) {
    toast({
      title: "Error occured!",
      description: error.response.data.message,
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "bottom",
    });
    setLoading(false);
  }
};

  return (
    <VStack  spacing='5px'>
   <FormControl id="first-name"  isRequired>
    <FormLabel>
       Name
    </FormLabel>
    <Input 
    value={name}
    placeholder='Enter your Name'
    onChange={(e)=> setName(e.target.value)}
    />
   </FormControl>


   <FormControl id="email" isRequired>
    <FormLabel>
       email
    </FormLabel>
    <Input 
    value={email}
    placeholder='Enter your Email'
    onChange={(e)=> setEmail(e.target.value)}
    />
   </FormControl>


   <FormControl id="password" isRequired>
    <FormLabel>
       password
    </FormLabel>
    <InputGroup>
    <Input 
    value={password}
    type={show?"text":"password"}
    placeholder='password'
    onChange={(e)=> setPassword(e.target.value)}
    />

    <InputRightElement width="4.5rem">
<Button h="1.75rem" size="sm" onClick={handleClick}>
  {show ? "Hide" : "Show"}
</Button>
    </InputRightElement>
    </InputGroup>
   </FormControl>

  

   
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Log in
      </Button>

      <Button
  variant="solid"
  colorScheme="red"
  width="100%"
  onClick={() => {
    setEmail("a6@gmail.com");
    setPassword("123456");
    setName("guest");
  }}
>
  Get Guest User Credentials
</Button>

   </VStack>
  )
}
